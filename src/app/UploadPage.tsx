"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Database, FileText } from "lucide-react"
import { useStore } from "@/store"
import { useToast } from "@/components/ui/use-toast"

export default function UploadPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setNote } = useStore()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
      }
    },
  })

  const handleFetchFromEHR = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setNote({
        id: "note-1",
        content: `Patient presents with chronic lower back pain that has persisted for over 6 months. Pain is described as dull and aching, rated 7/10 on the pain scale. Pain radiates down the left leg. Patient has tried over-the-counter NSAIDs with minimal relief. Physical therapy was attempted for 4 weeks with no significant improvement. MRI shows L4-L5 disc herniation with nerve root compression. Patient is requesting referral to pain management specialist for epidural steroid injections.`,
      })

      toast({
        title: "Note Retrieved",
        description: "Successfully fetched patient note from EHR",
        variant: "success",
      })

      setIsLoading(false)
      navigate("/gaps")
    }, 1000)
  }

  const handleContinue = async () => {
    if (!file) return

    setIsLoading(true)

    // In a real app, we would upload the file to a server
    // For now, we'll simulate parsing the PDF
    setTimeout(() => {
      setNote({
        id: "note-1",
        content: `Patient presents with chronic lower back pain that has persisted for over 6 months. Pain is described as dull and aching, rated 7/10 on the pain scale. Pain radiates down the left leg. Patient has tried over-the-counter NSAIDs with minimal relief. Physical therapy was attempted for 4 weeks with no significant improvement. MRI shows L4-L5 disc herniation with nerve root compression. Patient is requesting referral to pain management specialist for epidural steroid injections.`,
      })

      toast({
        title: "PDF Processed",
        description: "Successfully processed the uploaded PDF",
        variant: "success",
      })

      setIsLoading(false)
      navigate("/gaps")
    }, 1000)
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-[calc(100vh-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Upload Clinical Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-text-secondary" />
              <p className="mt-2 text-text-secondary">Drag & drop a PDF file here, or click to select</p>
              {file && (
                <div className="mt-4 p-2 bg-background rounded flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-text-secondary">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleFetchFromEHR}
              disabled={isLoading}
            >
              <Database className="mr-2 h-4 w-4" />
              Fetch from EHR
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={!file || isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
