"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"
import { useStore } from "@/hooks/useStore"

interface EvidenceModalProps {
  suggestionId: string
  isOpen: boolean
  onClose: () => void
}

export function EvidenceModal({ suggestionId, isOpen, onClose }: EvidenceModalProps) {
  const { updateSuggestion } = useStore()
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState("")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles])
    },
  })

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleSubmit = () => {
    // In a real app, we would upload the files to a server
    // For now, we'll just update the suggestion with the evidence notes
    updateSuggestion(suggestionId, {
      evidence: notes || `${files.length} file(s) attached as evidence`,
      status: "success",
      confidence: 100,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Evidence</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-10 w-10 text-text-secondary" />
            <p className="mt-2 text-sm text-text-secondary">Drag & drop files here, or click to select files</p>
            <p className="text-xs text-text-secondary mt-1">PDF, PNG, JPG or JPEG (max 10MB)</p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between text-sm p-2 bg-background rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button onClick={() => handleRemoveFile(index)} className="text-text-secondary hover:text-error">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Notes</h4>
            <textarea
              className="w-full min-h-[100px] p-2 border border-border rounded-md"
              placeholder="Add any additional notes about this evidence..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Attach Evidence</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
