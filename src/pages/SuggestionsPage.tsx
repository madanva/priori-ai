"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChip } from "@/components/StatusChip"
import { Progress } from "@/components/ui/progress"
import { EvidenceModal } from "@/components/EvidenceModal"
import { useStore } from "@/hooks/useStore"
import { Loader2 } from "lucide-react"
import { initializeMockData } from "@/hooks/useStore"
import { mockSuggestions, mockClinicalNote } from "@/lib/mockData"

export default function SuggestionsPage() {
  const navigate = useNavigate()
  const { patient, order, setSuggestions, suggestions, note, setNote } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null)

  useEffect(() => {
    if (!patient || !order) {
      navigate("/predict")
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Initialize mock data
        initializeMockData()

        // Set suggestions and note from mock data
        setSuggestions(mockSuggestions)
        setNote(mockClinicalNote)
      } catch (error) {
        console.error("Error getting suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [patient, order, navigate, setSuggestions, setNote])

  const handleAttachEvidence = (suggestionId: string) => {
    setSelectedSuggestionId(suggestionId)
  }

  const handleCloseModal = () => {
    setSelectedSuggestionId(null)
  }

  const handleContinue = () => {
    navigate("/draft")
  }

  // Function to highlight text based on criteria
  const renderHighlightedText = () => {
    if (!note?.content) return null

    if (!note.highlights || note.highlights.length === 0) {
      return <p className="whitespace-pre-line">{note.content}</p>
    }

    // Sort highlights by start position (to handle overlapping highlights)
    const sortedHighlights = [...note.highlights].sort((a, b) => a.start - b.start)

    const result = []
    let lastIndex = 0

    sortedHighlights.forEach((highlight, idx) => {
      // Add text before the highlight
      if (highlight.start > lastIndex) {
        result.push(note.content.substring(lastIndex, highlight.start))
      }

      // Add the highlighted text
      const suggestionItem = suggestions.find((s) => s.id === highlight.criteriaId)
      const highlightColor = suggestionItem
        ? suggestionItem.status === "success"
          ? "bg-success/20 border-success"
          : suggestionItem.status === "warning"
            ? "bg-alert/20 border-alert"
            : "bg-error/20 border-error"
        : ""

      result.push(
        <span
          key={`${highlight.criteriaId}-${idx}`}
          className={`border-b-2 px-0.5 ${highlightColor}`}
          title={`Criteria: ${suggestionItem?.rule}`}
        >
          {note.content.substring(highlight.start, highlight.end)}
        </span>,
      )

      lastIndex = highlight.end
    })

    // Add remaining text
    if (lastIndex < note.content.length) {
      result.push(note.content.substring(lastIndex))
    }

    return <p className="whitespace-pre-line">{result}</p>
  }

  // Get indicator color based on confidence
  const getIndicatorColor = (confidence: number, status: string) => {
    if (status === "success") return "bg-success"
    if (status === "warning") return "bg-alert"
    return "bg-error"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-text-secondary">Analyzing clinical documentation...</p>
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
            <div className="p-4 bg-white rounded-md border border-border">{renderHighlightedText()}</div>
          </CardContent>
        </Card>

        {/* Right panel: Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Missing Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((item) => (
                <div key={item.id} className="p-4 bg-background rounded-md border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{item.rule}</div>
                    <StatusChip
                      status={item.status}
                      label={item.status === "success" ? "Met" : item.status === "warning" ? "Partial" : "Missing"}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span>Confidence</span>
                      <span>{item.confidence}%</span>
                    </div>
                    <Progress
                      value={item.confidence}
                      className="h-2"
                      indicatorColor={getIndicatorColor(item.confidence, item.status)}
                    />
                  </div>

                  <p className="text-sm text-text-secondary mb-3">{item.description}</p>

                  {item.evidence ? (
                    <div className="text-xs text-success">Evidence attached: {item.evidence}</div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAttachEvidence(item.id)}>
                      Attach Evidence
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleContinue}>Generate Draft</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSuggestionId && (
        <EvidenceModal suggestionId={selectedSuggestionId} isOpen={!!selectedSuggestionId} onClose={handleCloseModal} />
      )}
    </motion.div>
  )
}
