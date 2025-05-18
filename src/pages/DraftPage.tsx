"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/hooks/useStore"
import { Loader2, Save, Eye, Edit2, Copy, Check, RefreshCw, CheckSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { mockDraftLetter } from "@/lib/mockData"
import { reviseDraft, checkApiHealth } from "@/lib/ollamaService"

export default function DraftPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { patient, order, suggestions, setDraft, draft } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const [isDiffView, setIsDiffView] = useState(false)
  const [originalDraft, setOriginalDraft] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [revisionInstructions, setRevisionInstructions] = useState("Check and revise this draft for clarity, coherence, and correctness. Ensure it meets medical necessity criteria.")
  const [isRevising, setIsRevising] = useState(false)
  const [ollamaAvailable, setOllamaAvailable] = useState(false)

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

        // Check if Ollama API is available
        const isAvailable = await checkApiHealth()
        setOllamaAvailable(isAvailable)
      } catch (error) {
        console.error("Error generating draft:", error)
        setOllamaAvailable(false)
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
    // Save the current draft
    setDraft(editorContent)
    navigate("/export")
  }
  
  const handleCritique = () => {
    // Save the current draft and go to critique page
    setDraft(editorContent)
    navigate("/critique")
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

  const handleReviseWithOllama = async () => {
    if (!draft) return
    
    setIsRevising(true)
    try {
      const response = await reviseDraft(draft, revisionInstructions)
      
      // Update the editor content and draft with the revised version
      setEditorContent(response.revised)
      setDraft(response.revised)
      
      toast({
        title: "Draft revised",
        description: "The draft has been revised using Ollama",
        variant: "success",
      })
    } catch (error) {
      console.error("Error revising draft:", error)
      toast({
        title: "Revision failed",
        description: "Failed to revise the draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRevising(false)
    }
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Authorization Letter</CardTitle>
          {ollamaAvailable ? (
            <span className="text-xs flex items-center text-green-600">
              <Check className="h-3 w-3 mr-1" />
              Ollama Available
            </span>
          ) : (
            <span className="text-xs text-amber-600">
              Ollama Unavailable
            </span>
          )}
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <div className="prose max-w-none p-4 border rounded-md bg-white whitespace-pre-line">{draft}</div>
          ) : isDiffView ? (
            renderDiff()
          ) : (
            <>
              <textarea 
                className="editor-content w-full min-h-[400px] p-4 border rounded-md" 
                value={editorContent} 
                onChange={handleEditorChange} 
              />
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Revision Instructions</h3>
                <textarea 
                  className="w-full p-2 border rounded-md text-sm" 
                  value={revisionInstructions}
                  onChange={(e) => setRevisionInstructions(e.target.value)}
                  placeholder="Instructions for Ollama to revise the draft..."
                  rows={2}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {ollamaAvailable && (
          <Button 
            variant="outline" 
            onClick={handleReviseWithOllama} 
            disabled={isRevising}
          >
            {isRevising ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Revising...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Revise with Ollama
              </>
            )}
          </Button>
        )}
        <Button variant="outline" onClick={handleCritique}>
          <CheckSquare className="h-4 w-4 mr-2" />
          Analyze Approval Chances
        </Button>
        <Button onClick={handleContinue}>
          <Save className="h-4 w-4 mr-2" />
          Continue to Export
        </Button>
      </div>
    </motion.div>
  )
}
