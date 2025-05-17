import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getStatusColor(status: "success" | "warning" | "error"): string {
  switch (status) {
    case "success":
      return "bg-success text-white"
    case "warning":
      return "bg-alert text-white"
    case "error":
      return "bg-error text-white"
    default:
      return "bg-gray-200 text-text"
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function formatCPTCode(code: string): string {
  return code.replace(/^([0-9]{5})$/, "$1")
}

export function formatICD10Code(code: string): string {
  if (!code) return code
  // Format ICD-10 codes like "A12.3"
  return code.replace(/^([A-Z][0-9]{2})([0-9]{1,2})$/, "$1.$2")
}
