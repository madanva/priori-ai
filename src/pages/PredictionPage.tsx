"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatusChip } from "@/components/StatusChip"
import { useStore } from "@/hooks/useStore"
import { formatCPTCode, formatICD10Code } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function PredictionPage() {
  const navigate = useNavigate()
  const { patient, order, setPrediction, getPredictionForOrder } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!patient || !order) {
      navigate("/")
      return
    }

    const fetchPrediction = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const result = getPredictionForOrder(order.cptCode)
        setPrediction(result)
      } catch (error) {
        console.error("Error predicting authorization:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrediction()
  }, [patient, order, navigate, setPrediction, getPredictionForOrder])

  const handleContinue = () => {
    navigate("/suggest")
  }

  // Determine status based on likelihood
  const getStatus = (likelihood: number) => {
    if (likelihood >= 0.8) return "success"
    if (likelihood >= 0.4) return "warning"
    return "error"
  }

  // Get appropriate label based on likelihood
  const getStatusLabel = (likelihood: number) => {
    if (likelihood >= 0.8) return "Likely Approved"
    if (likelihood >= 0.4) return `Risk: ${Math.round((1 - likelihood) * 100)}%`
    return "Unlikely Approved"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-text-secondary">Analyzing authorization request...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-[calc(100vh-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Authorization Prediction</CardTitle>
          <CardDescription>Analysis of the requested procedure for {patient?.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="p-4 bg-background rounded-md border border-border">
            <h3 className="font-medium mb-2">Requested Procedure</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-text-secondary">CPT Code:</span>
                <span className="ml-2 font-medium">{formatCPTCode(order?.cptCode || "")}</span>
              </div>
              <div>
                <span className="text-text-secondary">ICD-10:</span>
                <span className="ml-2 font-medium">{formatICD10Code(order?.icd10Code || "")}</span>
              </div>
              <div className="col-span-2">
                <span className="text-text-secondary">Description:</span>
                <span className="ml-2">{order?.description}</span>
              </div>
              <div className="col-span-2">
                <span className="text-text-secondary">Requested:</span>
                <span className="ml-2">
                  {order?.requestedDate ? new Date(order.requestedDate).toLocaleDateString() : "Today"}
                </span>
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          <div className="p-4 bg-background rounded-md border border-border">
            <div className="flex flex-col items-center justify-center text-center mb-4">
              <StatusChip
                status={getStatus(order ? getPredictionForOrder(order.cptCode).likelihood : 0)}
                label={getStatusLabel(order ? getPredictionForOrder(order.cptCode).likelihood : 0)}
                className="mb-2"
              />
              <div className="text-sm text-text-secondary">
                Confidence: {Math.round((order ? getPredictionForOrder(order.cptCode).likelihood : 0) * 100)}%
              </div>
            </div>

            {order && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Reasons:</h4>
                <ul className="text-sm space-y-1">
                  {getPredictionForOrder(order.cptCode).reasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleContinue}>Continue to Suggestions</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
