"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
}

export function VideoPlayer({ src, poster, title, className = "" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate)
      videoElement.addEventListener("ended", () => setIsPlaying(false))
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate)
        videoElement.removeEventListener("ended", () => setIsPlaying(false))
      }
    }
  }, [])

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-md text-sm">{title}</div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        playsInline
        controls
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="bg-white/90 rounded-full p-2 hover:bg-[#00B4A6] hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <div className="flex-1 mx-4">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-[#00B4A6]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="bg-white/90 rounded-full p-2 hover:bg-[#00B4A6] hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
