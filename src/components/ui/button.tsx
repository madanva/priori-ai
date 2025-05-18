import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1EBCBC]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1EBCBC] text-white hover:bg-[#0A9999] shadow-md shadow-[#1EBCBC]/20",
        destructive: "bg-[#F44336] text-white hover:bg-[#D32F2F] shadow-md shadow-[#F44336]/20",
        outline: "border border-[#E9ECEF] bg-white text-[#333333] hover:bg-[#F8F9FA] hover:text-[#1EBCBC] hover:border-[#1EBCBC]",
        secondary: "bg-[#F8F9FA] text-[#333333] hover:bg-[#E9ECEF]",
        ghost: "text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#1EBCBC]",
        link: "text-[#1EBCBC] underline-offset-4 hover:underline",
        success: "bg-[#4CAF50] text-white hover:bg-[#388E3C] shadow-md shadow-[#4CAF50]/20",
        alert: "bg-[#FF9800] text-white hover:bg-[#F57C00] shadow-md shadow-[#FF9800]/20",
        error: "bg-[#F44336] text-white hover:bg-[#D32F2F] shadow-md shadow-[#F44336]/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
