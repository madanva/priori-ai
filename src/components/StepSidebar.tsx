"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Users, FileSearch, FileEdit, FileOutput, Zap, CheckSquare } from "lucide-react"
import { Logo } from "./Logo"

const steps = [
  { id: "landing", path: "/", icon: Users, label: "Patient" },
  { id: "predict", path: "/predict", icon: Zap, label: "Predict" },
  { id: "suggest", path: "/suggest", icon: FileSearch, label: "Suggest" },
  { id: "draft", path: "/draft", icon: FileEdit, label: "Draft" },
  { id: "critique", path: "/critique", icon: CheckSquare, label: "Critique" },
  { id: "export", path: "/export", icon: FileOutput, label: "Export" },
]

export function StepSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => step.path === currentPath)

  return (
    <div className="hidden md:flex flex-col w-20 bg-white border-r border-[#E9ECEF]">
      <div className="flex items-center justify-center h-16 border-b border-[#E9ECEF] p-2">
        <Logo size="small" withText={false} />
      </div>
      <div className="flex flex-col items-center py-8 space-y-8">
        {steps.map((step, index) => {
          const isActive = step.path === currentPath
          const isCompleted = index < currentStepIndex
          const isDisabled = index > currentStepIndex + 1

          return (
            <button
              key={step.id}
              className={cn(
                "flex flex-col items-center justify-center w-full p-2 space-y-1 transition-all duration-200",
                isActive ? "text-[#1EBCBC]" : "text-[#6C757D]",
                isCompleted ? "text-[#4CAF50]" : "",
                isDisabled ? "opacity-40 cursor-not-allowed" : "hover:text-[#1EBCBC] cursor-pointer",
              )}
              onClick={() => !isDisabled && navigate(step.path)}
              disabled={isDisabled}
            >
              <div className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive ? "bg-[#1EBCBC]/10" : "",
                isCompleted ? "bg-[#4CAF50]/10" : "",
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{step.label}</span>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-0.5 h-8 mt-2", 
                  isCompleted ? "bg-[#4CAF50]" : "bg-[#E9ECEF]",
                  isActive ? "bg-[#1EBCBC]" : "",
                )} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
