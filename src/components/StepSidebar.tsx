"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Users, FileSearch, FileEdit, FileOutput, Zap } from "lucide-react"

const steps = [
  { id: "landing", path: "/", icon: Users, label: "Patient" },
  { id: "predict", path: "/predict", icon: Zap, label: "Predict" },
  { id: "suggest", path: "/suggest", icon: FileSearch, label: "Suggest" },
  { id: "draft", path: "/draft", icon: FileEdit, label: "Draft" },
  { id: "export", path: "/export", icon: FileOutput, label: "Export" },
]

export function StepSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => step.path === currentPath)

  return (
    <div className="hidden md:flex flex-col w-20 bg-white border-r border-border">
      <div className="flex items-center justify-center h-16 border-b border-border">
        <div className="text-primary font-bold text-xl">AS</div>
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
                "flex flex-col items-center justify-center w-full p-2 space-y-1 transition-colors",
                isActive ? "text-primary" : "text-text-secondary",
                isCompleted ? "text-success" : "",
                isDisabled ? "opacity-40 cursor-not-allowed" : "hover:text-primary cursor-pointer",
              )}
              onClick={() => !isDisabled && navigate(step.path)}
              disabled={isDisabled}
            >
              <step.icon className="w-6 h-6" />
              <span className="text-xs">{step.label}</span>
              {index < steps.length - 1 && (
                <div className={cn("w-0.5 h-8 mt-2 bg-border", isCompleted ? "bg-success" : "")} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
