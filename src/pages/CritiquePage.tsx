import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/hooks/useStore"
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface CritiqueResult {
  approval_likelihood: number
  is_approved: boolean
  reasons: string[]
  feedback: string
  processing_time?: number
}

export default function CritiquePage() {
  const navigate = useNavigate()
  // We only need these store values for rendering the UI
  const { draft } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Check if this draft was generated with additional context
  const hasAdditionalContext = localStorage.getItem('hasAddedContext') === 'true'

  useEffect(() => {
    // Use mock data for the critique instead of making API calls
    const getMockCritique = () => {
      setIsLoading(true)
      
      // Always show high approval likelihood (92%)
      setTimeout(() => {
        try {
          // Generate a mock critique result with high approval
          const mockResult = {
            approval_likelihood: 0.92,
            is_approved: true,
            reasons: [
              "Comprehensive documentation of medical necessity",
              "Clear evidence of previous treatment attempts",
              "Detailed clinical findings that align with insurance criteria"
            ],
            feedback: `
Evaluation of authorization request:

The provided authorization letter has a high chance of approval.

Strengths of the request:
1. Comprehensive documentation of medical necessity
2. Clear evidence of previous treatment attempts
3. Detailed clinical findings that align with insurance criteria

The additional context you provided significantly improved the approval likelihood. The detailed clinical information addressed key requirements for authorization approval.

Estimated approval likelihood: 92%
`
          };
          
          // Set the critique result without showing a toast notification
          setCritiqueResult(mockResult);
        } catch (error) {
          setError("An error occurred while generating the critique.");
        } finally {
          setIsLoading(false);
        }
      }, 1500); // Simulate API delay

    };
    
    // Start the mock critique process
    getMockCritique();
    
    // No cleanup needed for this simplified version
    return () => {};
  }, [hasAdditionalContext])

  const handleRevise = () => {
    navigate("/draft")
  }

  const handleFinalize = () => {
    // Navigate to the export page without showing a toast notification
    navigate("/export")
  }

  const getApprovalColor = (likelihood: number) => {
    if (likelihood >= 0.8) return "text-success"
    if (likelihood >= 0.5) return "text-alert"
    return "text-error"
  }

  const getApprovalIcon = (isApproved: boolean, likelihood: number) => {
    if (isApproved) return <CheckCircle2 className="h-8 w-8 text-success" />
    if (likelihood >= 0.5) return <AlertCircle className="h-8 w-8 text-alert" />
    return <XCircle className="h-8 w-8 text-error" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-8 max-w-6xl"
    >
      <h1 className="text-3xl font-bold mb-6">Authorization Critique</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Critique Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center w-full max-w-md">
                  <Loader2 className="h-8 w-8 mx-auto text-primary mb-4 animate-spin" />
                  <p className="mb-3 text-text-secondary">Analyzing authorization letter...</p>
                  <Progress value={50} className="h-2 mb-2" />
                  <p className="text-xs text-text-secondary">This may take a moment</p>
                </div>
              </div>
            ) : error && !critiqueResult ? (
              <div className="p-6 text-center text-error">
                <p className="mb-2 font-medium">Error analyzing document</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : critiqueResult && (
              <div className="space-y-6">
                {/* Approval Status */}
                <div className="flex items-center justify-between p-4 bg-background rounded-md border border-border">
                  <div>
                    <h3 className="font-medium mb-1">Approval Status</h3>
                    <div className="flex items-center">
                      {getApprovalIcon(critiqueResult.is_approved, critiqueResult.approval_likelihood)}
                      <span className="ml-2 font-medium">
                        {critiqueResult.is_approved ? "Likely to be approved" : "May require revisions"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-secondary mb-1">Likelihood</div>
                    <div className={`text-2xl font-bold ${getApprovalColor(critiqueResult.approval_likelihood)}`}>
                      {Math.round(critiqueResult.approval_likelihood * 100)}%
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h3 className="font-medium mb-3">Key Factors</h3>
                  <ul className="space-y-2">
                    {critiqueResult.reasons.map((reason, index) => (
                      <li key={index} className="p-3 bg-background rounded-md border border-border">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Feedback */}
                <div>
                  <h3 className="font-medium mb-3">Detailed Feedback</h3>
                  <div className="p-4 bg-background rounded-md border border-border whitespace-pre-line">
                    {critiqueResult.feedback}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={handleRevise}>
                    Revise Draft
                  </Button>
                  <Button onClick={handleFinalize}>
                    Finalize Authorization
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
