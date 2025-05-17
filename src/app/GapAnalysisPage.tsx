"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChip } from "@/components/StatusChip"
import { EvidenceModal } from "@/components/EvidenceModal"
import { useStore } from "@/store"
import type { Criteria } from "@/store"
import { Loader2 } from "lucide-react"

export default function GapAnalysisPage() {
  const navigate = useNavigate()
  const { note, setCriteria, criteria } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null)

  useEffect(() => {
    if (!note) {
      navigate("/upload")
      return
    }

    // Simulate API call to analyze the note
    const timer = setTimeout(() => {
      const mockCriteria: Criteria[] = [
        {
          id: "c1",
          rule: "Pain duration > 3 months",
          status: "success",
          confidence: 95,
        },
        {
          id: "c2",
          rule: "Failed conservative treatment",
          status: "success",
          confidence: 90,
        },
        {
          id: "c3",
          rule: "Documented physical exam findings",
          status: "warning",
          confidence: 70,
        },
        {
          id: "c4",
          rule: "Imaging confirms pathology",
          status: "success",
          confidence: 85,
        },
        {
          id: "c5",
          rule: "Pain scale documentation",
          status: "success",
          confidence: 100,
        },
        {
          id: "c6",
          rule: "Functional impairment documented",
          status: "error",
          confidence: 30,
        },
      ]

      setCriteria(mockCriteria)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [note, navigate, setCriteria])

  const handleAttachEvidence = (criteriaId: string) => {
    setSelectedCriteriaId(criteriaId)
  }

  const handleCloseModal = () => {
    setSelectedCriteriaId(null)
  }

  const handleContinue = () => {
    navigate("/draft")
  }

  // Function to highlight text based on criteria
  const renderHighlightedText = () => {
    if (!note) return null

    // In a real app, we would use the highlights from the note
    // For now, we'll just highlight some keywords
    const keywords = {
      chronic: "c1",
      "6 months": "c1",
      NSAIDs: "c2",
      "Physical therapy": "c2",
      "pain scale": "c5",
      MRI: "c4",
      "disc herniation": "c4",
    }

    const content = note.content
    const result = []
    let lastIndex = 0

    // Simple keyword highlighting (in a real app, this would be more sophisticated)
    Object.entries(keywords).forEach(([keyword, criteriaId]) => {
      const index = content.indexOf(keyword, lastIndex)
      if (index !== -1) {
        // Add text before the keyword
        if (index > lastIndex) {
          result.push(content.substring(lastIndex, index))
        }

        // Add the highlighted keyword
        const criteriaItem = criteria.find((c) => c.id === criteriaId)
        const highlightColor = criteriaItem
          ? criteriaItem.status === "success"
            ? "bg-success/20 border-success"
            : criteriaItem.status === "warning"
              ? "bg-alert/20 border-alert"
              : "bg-error/20 border-error"
          : ""

        result.push(
          <span
            key={`${criteriaId}-${index}`}
            className={`border-b-2 px-0.5 ${highlightColor}`}
            title={`Criteria: ${criteriaItem?.rule}`}
          >
            {keyword}
          </span>,
        )

        lastIndex = index + keyword.length
      }
    })

    // Add remaining text
    if (lastIndex < content.length) {
      result.push(content.substring(lastIndex))
    }

    return result
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-text-secondary">Analyzing clinical note...</p>
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
      <h1 className="text-2xl font-bold mb-6">Gap Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Clinical note with highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-md border border-border">
              <p className="whitespace-pre-line">{renderHighlightedText()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right panel: Criteria table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coverage Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 font-medium">Criteria</th>
                    <th className="text-left py-2 px-4 font-medium">Status</th>
                    <th className="text-left py-2 px-4 font-medium">Confidence</th>
                    <th className="text-left py-2 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((item) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="py-2 px-4">{item.rule}</td>
                      <td className="py-2 px-4">
                        <StatusChip
                          status={item.status}
                          label={item.status === "success" ? "Met" : item.status === "warning" ? "Partial" : "Missing"}
                        />
                      </td>
                      <td className="py-2 px-4">{item.confidence}%</td>
                      <td className="py-2 px-4">
                        {item.evidence ? (
                          <span className="text-xs text-success">Evidence attached</span>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleAttachEvidence(item.id)}>
                            Attach Evidence
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleContinue}>Generate Draft</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedCriteriaId && (
        <EvidenceModal criteriaId={selectedCriteriaId} isOpen={!!selectedCriteriaId} onClose={handleCloseModal} />
      )}
    </motion.div>
  )
}
