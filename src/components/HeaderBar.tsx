"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks/useStore"
import { Cpu, HardDrive, RotateCcw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"

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
    <header className="h-16 border-b border-[#E9ECEF] flex items-center justify-between px-6 bg-white shadow-sm">
      <div className="flex items-center">
        <Logo size="small" withText={true} />
        {patient && (
          <div className="ml-6 pl-6 border-l border-[#E9ECEF] flex items-center">
            <div className="bg-[#1EBCBC]/10 p-1.5 rounded-full mr-2">
              <User className="w-4 h-4 text-[#1EBCBC]" />
            </div>
            <div>
              <span className="text-[#333333] font-medium">{patient.name}</span>
              <span className="ml-2 text-xs text-[#6C757D]">DOB: {patient.dob}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {isOnline ? (
            <div className="flex items-center text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs font-medium">On Device</span>
            </div>
          ) : (
            <div className="flex items-center text-[#F44336] bg-[#F44336]/10 px-2 py-1 rounded-full">
              <HardDrive className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs font-medium">Not On Device</span>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="text-[#A0A0A0] hover:text-white hover:bg-[#333] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>
    </header>
  )
}
