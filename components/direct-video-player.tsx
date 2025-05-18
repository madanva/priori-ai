"use client"

import { useState, useRef } from "react"

interface DirectVideoPlayerProps {
  src: string
  title?: string
  className?: string
}

export function DirectVideoPlayer({ src, title, className = "" }: DirectVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isError, setIsError] = useState(false)

  const handleError = () => {
    setIsError(true)
    console.error("Error loading video from:", src)
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-md text-sm">{title}</div>
      )}

      {isError ? (
        <div className="aspect-video bg-gray-100 flex items-center justify-center p-4 text-center">
          <div>
            <p className="text-gray-500 mb-2">Unable to load video</p>
            <a href={src} target="_blank" rel="noopener noreferrer" className="text-[#00B4A6] hover:underline">
              Open video in new tab
            </a>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          controls
          playsInline
          onError={handleError}
        />
      )}
    </div>
  )
}
