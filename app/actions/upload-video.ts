"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadVideo(formData: FormData) {
  const file = formData.get("video") as File

  if (!file) {
    return { error: "No video file provided" }
  }

  // Validate file type
  if (!file.type.startsWith("video/")) {
    return { error: "File must be a video" }
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(`videos/${file.name}`, file, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    })

    // Revalidate the path to show the new video
    revalidatePath("/")

    return {
      success: true,
      url: blob.url,
      contentType: blob.contentType,
    }
  } catch (error) {
    console.error("Error uploading video:", error)
    return { error: "Failed to upload video" }
  }
}

export async function uploadVideoFromUrl(url: string, filename: string) {
  try {
    // Fetch the video from the URL
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`)
    }

    // Get the file as a blob
    const fileBlob = await response.blob()

    // Create a File object from the blob
    const file = new File([fileBlob], filename, { type: fileBlob.type })

    // Upload to Vercel Blob
    const blob = await put(`videos/${filename}`, file, {
      access: "public",
      contentType: fileBlob.type || "video/mp4",
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    })

    // Revalidate the path to show the new video
    revalidatePath("/")

    return {
      success: true,
      url: blob.url,
      contentType: blob.contentType,
    }
  } catch (error) {
    console.error("Error uploading video from URL:", error)
    return { error: `Failed to upload video from URL: ${error.message}` }
  }
}
