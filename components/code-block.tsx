"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-md bg-gray-100 font-mono text-sm my-2">
      <div className="overflow-x-auto p-4">
        <pre className="text-gray-800">{code}</pre>
      </div>
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-1.5 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
      </button>
    </div>
  )
}
