"use client"

import type React from "react"

import { useState } from "react"
import { uploadVideoFromUrl } from "@/app/actions/upload-video"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function FetchVideoPage() {
  const [videoUrl, setVideoUrl] = useState(
    "https://oxbglyzipyvssqlvqkfu.supabase.co/storage/v1/object/public/videos/Priori%20AI%20Demo%208VC%20Hackathon.mp4",
  )
  const [filename, setFilename] = useState("priori-ai-demo.mp4")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; url?: string; error?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const result = await uploadVideoFromUrl(videoUrl, filename)
      setResult(result)
    } catch (error) {
      setResult({ error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Fetch Video from URL</CardTitle>
          <CardDescription>Download a video from an external URL and upload it to Vercel Blob</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="videoUrl" className="block text-sm font-medium">
                Video URL
              </label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="filename" className="block text-sm font-medium">
                Filename
              </label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-video.mp4"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-[#00B4A6] hover:bg-[#009990] text-white w-full">
              {isLoading ? "Fetching and Uploading..." : "Fetch and Upload"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {result?.success && (
            <div className="w-full p-4 bg-green-50 text-green-700 rounded-md">
              <p className="font-medium">Upload successful!</p>
              <p className="text-sm mt-1 break-all">URL: {result.url}</p>
              <div className="mt-4">
                <a href="/" className="text-[#00B4A6] hover:underline">
                  View on homepage
                </a>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="w-full p-4 bg-red-50 text-red-700 rounded-md">
              <p>Error: {result.error}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
