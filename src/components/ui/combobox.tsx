"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxProps {
  options: { label: string; value: string }[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  triggerClassName?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  className,
  triggerClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(value || "")
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value)
    }
  }, [value])

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", triggerClassName)}
        >
          {selected ? options.find((option) => option.value === selected)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[300px] p-0", className)}>
        <div className="flex items-center border-b border-border p-2">
          <input
            className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredOptions.length === 0 && (
            <div className="py-6 text-center text-sm text-text-secondary">{emptyMessage}</div>
          )}
          <div className="p-1">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  selected === option.value ? "bg-background text-primary" : "text-text",
                )}
                onClick={() => {
                  const newValue = option.value === selected ? "" : option.value
                  setSelected(newValue)
                  onValueChange?.(newValue)
                  setOpen(false)
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", selected === option.value ? "opacity-100" : "opacity-0")} />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
