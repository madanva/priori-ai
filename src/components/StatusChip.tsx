import { cn, getStatusColor } from "@/lib/utils"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StatusChipProps {
  status: "success" | "warning" | "error"
  label?: string
  className?: string
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  const statusColor = getStatusColor(status)

  const StatusIcon = {
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  }[status]

  return (
    <div
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusColor, className)}
    >
      <StatusIcon className="w-3.5 h-3.5 mr-1" />
      {label || status}
    </div>
  )
}
