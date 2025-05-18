"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChip } from "@/components/StatusChip"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/hooks/useStore"
import { Loader2, FileText, PlusCircle, X, Check, Upload, File, Trash2 } from "lucide-react"
import { initializeMockData } from "@/hooks/useStore"
import { mockSuggestions, mockClinicalNote, mockDraftLetter } from "@/lib/mockData"
import { analyzeClinicalNote, Suggestion } from "@/lib/ollamaService"
import { useToast } from "@/components/ui/use-toast"

export default function SuggestionsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { patient, order, setSuggestions, suggestions, note, setNote, setDraft } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [additionalContext, setAdditionalContext] = useState('')
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null)
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false)
  const [expandedCriteriaId, setExpandedCriteriaId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isPdfUploading, setIsPdfUploading] = useState(false)

  useEffect(() => {
    if (!patient || !order) {
      console.log("No patient or order, navigating to predict page")
      navigate("/predict")
      return
    }

    const fetchSuggestions = async () => {
      console.log("Starting fetchSuggestions")
      setIsLoading(true)
      try {
        // Initialize mock data for the note only
        console.log("Initializing mock data for note only")
        initializeMockData()
        setNote(mockClinicalNote)
        
        // Start analysis
        setIsAnalyzing(true)
        
        try {
          // Check if Ollama API is available
          console.log("Checking if Ollama API is available")
          const healthResponse = await fetch('http://localhost:5001/api/health')
          
          if (healthResponse.ok && note?.content) {
            // Simple delay for loading animation
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Analyze with Ollama
            console.log("Analyzing with Ollama")
            const result = await analyzeClinicalNote(note.content)
            // Set suggestions all at once for simplicity without showing a toast
            console.log("Setting suggestions")
            setSuggestions(result.suggestions || [])
          } else {
            // Fall back to mock data
            console.log("Using mock data")
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSuggestions(mockSuggestions)
            
            // No toast notification for fallback to mock data
            console.log("Ollama service is not available, using mock data");
          }
        } catch (error) {
          console.error("Error:", error)
          setSuggestions(mockSuggestions)
          
          // No toast notification for analysis failure
          console.log("Analysis failed, using sample data instead.")
        } finally {
          // Delay to ensure progress bar is visible
          await new Promise(resolve => setTimeout(resolve, 500))
          setIsAnalyzing(false)
        }
      } catch (error) {
        console.error("Error in overall process:", error)
        setSuggestions(mockSuggestions)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [patient, order, navigate, setSuggestions, setNote, note, toast])

  const handleContinue = () => {
    // Generate a draft based on the suggestions and additional context
    generateDraft()
  }
  
  const generateDraft = async () => {
    setIsGeneratingDraft(true)
    
    try {
      // In a real application, we would send the additional context to the backend
      // For now, we'll just use mock data with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Set the draft and navigate to the draft page without showing a toast
      setDraft(mockDraftLetter)
      navigate("/draft")
    } catch (error) {
      console.error("Error generating draft:", error)
      
      toast({
        title: "Error",
        description: "There was an error generating your draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDraft(false)
    }
  }
  
  const handleAddEhrInfo = (criteriaId: string) => {
    // Toggle the expanded state for this criteria
    setExpandedCriteriaId(expandedCriteriaId === criteriaId ? null : criteriaId)
    setSelectedCriteriaId(criteriaId)
    setAdditionalContext('')
  }
  
  const handleContextSubmit = () => {
    if (!additionalContext.trim()) {
      console.log("Empty context provided")
      return
    }
    
    // Find the selected criteria
    const selectedCriteria = Array.isArray(suggestions) 
      ? suggestions.find(s => s.id === selectedCriteriaId)
      : null
    
    // Set flag in localStorage to indicate additional context was provided
    localStorage.setItem('hasAddedContext', 'true')
    
    // No toast notification for context added
    console.log(`Additional context for "${selectedCriteria?.rule || 'criteria'}" has been added.`)
    
    // Close the expanded section and reset the form
    setExpandedCriteriaId(null)
    
    // In a real application, we would update the criteria with the additional context
    // For now, we'll just clear the form
    setTimeout(() => {
      setAdditionalContext('')
      setSelectedCriteriaId(null)
    }, 300)
  }
  
  const handleCancelContext = () => {
    setExpandedCriteriaId(null)
    setAdditionalContext('')
    setUploadedFiles([])
  }
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).filter(file => file.type === 'application/pdf')
      if (newFiles.length > 0) {
        setIsPdfUploading(true)
        
        // Simulate PDF processing
        setTimeout(() => {
          setUploadedFiles(prev => [...prev, ...newFiles])
          setIsPdfUploading(false)
          
          // Add a note about the uploaded PDF to the additional context
          const fileNames = newFiles.map(file => file.name).join(', ')
          setAdditionalContext(prev => 
            prev + (prev ? '\n\n' : '') + 
            `Uploaded PDF document(s): ${fileNames}\n` +
            `These documents contain additional clinical evidence to support this authorization request.`
          )
          
          console.log(`Uploaded PDF(s): ${fileNames}`)
        }, 1000)
      }
    }
  }
  
  const handleRemoveFile = (fileIndex: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== fileIndex))
  }

  // Function to highlight text based on criteria
  const renderHighlightedText = () => {
    if (!note?.content) {
      return <p>No clinical note available.</p>
    }

    // Simple rendering without highlights for reliability
    return <p className="whitespace-pre-line">{note.content}</p>
  }

  // Function removed - was used for progress bar colors

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center w-64">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="mb-3 text-text-secondary">Analyzing clinical documentation...</p>
          <Progress value={45} className="h-2" />
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
      <h1 className="text-2xl font-bold mb-6">Missing Criteria</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Clinical note with highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-center w-full max-w-md">
                  <FileText className="h-8 w-8 mx-auto text-primary mb-4" />
                  <p className="mb-3 text-text-secondary">Analyzing clinical documentation with Ollama...</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-md border border-border">{renderHighlightedText()}</div>
            )}
          </CardContent>
        </Card>

        {/* Right panel: Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Missing Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center w-full max-w-md">
                  <Loader2 className="h-8 w-8 mx-auto text-primary mb-4 animate-spin" />
                  <p className="mb-3 text-text-secondary">Analyzing clinical documentation...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {Array.isArray(suggestions) && suggestions.map((item) => {
                    console.log(`Rendering suggestion: ${item.id}, status: ${item.status}`);
                    return (
                    <div key={item.id} className="p-4 bg-background rounded-md border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{item.rule}</div>
                        <StatusChip
                          status={item.status === "success" ? "success" : item.status === "warning" ? "warning" : "error"}
                          label={item.status === "success" ? "Met" : item.status === "warning" ? "Partial" : "Missing"}
                        />
                      </div>

                      {/* Removed confidence progress bar */}

                      <p className="text-sm text-text-secondary mb-3">{item.description}</p>
                      
                      {/* Add button for missing documentation */}
                      {item.status === "error" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleAddEhrInfo(item.id)} className="mt-1">
                            <PlusCircle className="h-3.5 w-3.5 mr-1" />
                            {expandedCriteriaId === item.id ? "Cancel" : "Add Additional Context"}
                          </Button>
                          
                          {/* Inline context form */}
                          {expandedCriteriaId === item.id && (
                            <div className="mt-3 border border-border rounded-md p-3 bg-background">
                              <p className="text-sm font-medium mb-2">Additional Context</p>
                              <textarea
                                className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                                value={additionalContext}
                                onChange={(e) => setAdditionalContext(e.target.value)}
                                placeholder="Enter additional clinical information, test results, or documentation here..."
                              />
                              
                              {/* PDF Upload Section */}
                              <div className="mt-3 border border-dashed border-border rounded-md p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium">Upload Supporting Documents</p>
                                  <label className="cursor-pointer inline-flex items-center text-xs text-primary hover:text-primary/80">
                                    <Upload className="h-3.5 w-3.5 mr-1" />
                                    Upload PDF
                                    <input 
                                      type="file" 
                                      accept="application/pdf" 
                                      className="hidden" 
                                      onChange={handleFileUpload}
                                      multiple
                                    />
                                  </label>
                                </div>
                                
                                {isPdfUploading && (
                                  <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                                    <span className="text-xs">Processing PDF...</span>
                                  </div>
                                )}
                                
                                {/* Uploaded Files List */}
                                {uploadedFiles.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {uploadedFiles.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between bg-background/50 p-2 rounded-md text-xs">
                                        <div className="flex items-center">
                                          <File className="h-3.5 w-3.5 mr-1 text-primary" />
                                          <span className="truncate max-w-[180px]">{file.name}</span>
                                        </div>
                                        <button 
                                          onClick={() => handleRemoveFile(index)}
                                          className="text-text-secondary hover:text-error"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex justify-end gap-2 mt-3">
                                <Button variant="outline" size="sm" onClick={handleCancelContext}>
                                  <X className="h-3.5 w-3.5 mr-1" />
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={handleContextSubmit}>
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  Add Context
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                  })}
                  
                  {(!Array.isArray(suggestions) || suggestions.length === 0) && (
                    <div className="p-4 text-center text-text-secondary">
                      No missing criteria found.
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleContinue} disabled={isGeneratingDraft}>
                    {isGeneratingDraft ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Draft"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
