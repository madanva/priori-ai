"use client"

import type React from "react"

import { useState } from "react"
import { uploadVideo } from "@/app/actions/upload-video"
import { Button } from "@/components/ui/button"

export function VideoUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success?: boolean; url?: string; error?: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await uploadVideo(formData)
      setUploadResult(result)
    } catch (error) {
      setUploadResult({ error: "An unexpected error occurred" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="video" className="block text-sm font-medium">
            Select Video File
          </label>
          <input
            id="video"
            name="video"
            type="file"
            accept="video/*"
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00B4A6] file:text-white hover:file:bg-[#009990]"
          />
        </div>
        <Button type="submit" disabled={isUploading} className="bg-[#00B4A6] hover:bg-[#009990] text-white w-full">
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </form>

      {uploadResult?.success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Upload successful!</p>
          <p className="text-sm mt-1 break-all">URL: {uploadResult.url}</p>
        </div>
      )}

      {uploadResult?.error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error: {uploadResult.error}</p>
        </div>
      )}
    </div>
  )
}
