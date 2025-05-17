"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/hooks/useStore"
import { Loader2, Save, Eye, Edit2, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { mockDraftLetter } from "@/lib/mockData"

export default function DraftPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { patient, order, suggestions, setDraft, draft } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const [isDiffView, setIsDiffView] = useState(false)
  const [originalDraft, setOriginalDraft] = useState("")
  const [editorContent, setEditorContent] = useState("")

  useEffect(() => {
    if (!patient || !order) {
      navigate("/suggest")
      return
    }

    const generateDraft = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Set draft from mock data
        const generatedDraft = mockDraftLetter
        setOriginalDraft(generatedDraft)
        setEditorContent(generatedDraft)
        setDraft(generatedDraft)
      } catch (error) {
        console.error("Error generating draft:", error)
      } finally {
        setIsLoading(false)
      }
    }

    generateDraft()
  }, [patient, order, suggestions, navigate, setDraft])

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditorContent(newContent)
    setDraft(newContent)
  }

  const handleContinue = () => {
    navigate("/export")
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
    setIsDiffView(false)
  }

  const toggleDiffView = () => {
    setIsDiffView(!isDiffView)
    setIsPreview(false)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draft)
    toast({
      title: "Copied to clipboard",
      description: "The draft has been copied to your clipboard",
      variant: "success",
    })
  }

  // Simple diff view (in a real app, you'd use a proper diff library)
  const renderDiff = () => {
    // This is a very simplified diff view
    const added = draft.length > originalDraft.length

    return (
      <div className="diff-view p-4 border rounded-md bg-white">
        <div className={added ? "diff-added" : "diff-removed"}>{draft}</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-text-secondary">Generating authorization letter...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Draft Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={togglePreview}>
            {isPreview ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleDiffView}>
            {isDiffView ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Diff View
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to EHR
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Authorization Letter</CardTitle>
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <div className="prose max-w-none p-4 border rounded-md bg-white whitespace-pre-line">{draft}</div>
          ) : isDiffView ? (
            renderDiff()
          ) : (
            <textarea className="editor-content w-full" value={editorContent} onChange={handleEditorChange} />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue}>
          <Save className="h-4 w-4 mr-2" />
          Continue to Export
        </Button>
      </div>
    </motion.div>
  )
}
