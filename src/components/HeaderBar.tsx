"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks/useStore"
import { Wifi, WifiOff, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeaderBar() {
  const navigate = useNavigate()
  const { isOnline, setIsOnline, patient, resetState } = useStore()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [setIsOnline])

  const handleReset = () => {
    resetState()
    navigate("/")
  }

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-primary">AuthStream AI</h1>
        {patient && (
          <div className="ml-4 pl-4 border-l border-border">
            <span className="text-sm text-text-secondary">Patient:</span>
            <span className="ml-2 font-medium">{patient.name}</span>
            <span className="ml-2 text-sm text-text-secondary">DOB: {patient.dob}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {isOnline ? (
            <div className="flex items-center text-success">
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-xs">Online</span>
            </div>
          ) : (
            <div className="flex items-center text-error">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-xs">Offline</span>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="flex items-center">
          <RotateCcw className="w-4 h-4 mr-1" />
          <span>Reset</span>
        </Button>
      </div>
    </header>
  )
}
