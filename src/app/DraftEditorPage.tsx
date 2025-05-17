"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/store"
import { Loader2, Save, Eye, Edit2 } from "lucide-react"

export default function DraftEditorPage() {
  const navigate = useNavigate()
  const { criteria, setDraft, draft } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const [generatedDraft, setGeneratedDraft] = useState("")

  useEffect(() => {
    if (criteria.length === 0) {
      navigate("/gaps")
      return
    }

    // Simulate API call to generate draft
    const timer = setTimeout(() => {
      const mockDraft = `
Dear Insurance Provider,

I am writing to request prior authorization for epidural steroid injections for my patient, John Doe (DOB: 05/12/1978, Insurance ID: BC123456).

Clinical Summary:
The patient presents with chronic lower back pain that has persisted for over 6 months. The pain is described as dull and aching, rated 7/10 on the pain scale. The pain radiates down the left leg, consistent with radiculopathy.

Treatment History:
The patient has tried conservative management including:
- Over-the-counter NSAIDs with minimal relief
- Physical therapy for 4 weeks with no significant improvement

Diagnostic Findings:
MRI of the lumbar spine shows L4-L5 disc herniation with nerve root compression, which correlates with the patient's symptoms.

Based on the patient's clinical presentation, failed conservative treatment, and diagnostic findings, epidural steroid injections are medically necessary to alleviate pain, improve function, and potentially avoid surgical intervention.

Thank you for your consideration of this request. Please feel free to contact our office if you require any additional information.

Sincerely,
Dr. Smith
      `.trim()

      setGeneratedDraft(mockDraft)
      setDraft(mockDraft)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [criteria, navigate, setDraft])

  const editor = useEditor({
    extensions: [StarterKit],
    content: generatedDraft,
    onUpdate: ({ editor }) => {
      setDraft(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && generatedDraft && !editor.getText()) {
      editor.commands.setContent(generatedDraft)
    }
  }, [editor, generatedDraft])

  const handleContinue = () => {
    navigate("/export")
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-text-secondary">Generating prior authorization letter...</p>
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
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Prior Authorization Letter</CardTitle>
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <div className="prose max-w-none p-4 border rounded-md bg-white">
              <div dangerouslySetInnerHTML={{ __html: draft }} />
            </div>
          ) : (
            <EditorContent editor={editor} className="min-h-[500px]" />
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
