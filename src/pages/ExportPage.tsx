"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useStore } from "@/hooks/useStore"
import { useToast } from "@/components/ui/use-toast"
import { FileIcon as FilePdf, Send, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

export default function ExportPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { patient, order, draft, setExportStatus, exportStatus } = useStore()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    setExportStatus("generating")

    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setExportStatus("success")

      toast({
        title: "Export Successful",
        description: "Prior authorization letter has been exported as PDF",
        variant: "success",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      setExportStatus("error")

      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendEDI = () => {
    setIsExporting(true)
    setExportStatus("generating")

    // Simulate EDI transmission
    setTimeout(() => {
      setIsExporting(false)
      setExportStatus("success")

      toast({
        title: "EDI Transmission Successful",
        description: "Prior authorization request has been sent via EDI-278",
        variant: "success",
      })
    }, 2000)
  }

  const handleStartNew = () => {
    navigate("/")
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
          <CardTitle className="text-center">Export Options</CardTitle>
          <CardDescription className="text-center">Your authorization letter is ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-md border border-border">
              <h3 className="font-medium">Summary</h3>
              <div className="mt-2 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Patient:</span> {patient?.name}
                </p>
                <p>
                  <span className="font-medium">DOB:</span> {patient?.dob}
                </p>
                <p>
                  <span className="font-medium">CPT Code:</span> {order?.cptCode}
                </p>
                <p>
                  <span className="font-medium">Procedure:</span> {order?.description}
                </p>
                <p>
                  <span className="font-medium">Letter Length:</span> {draft.length} characters
                </p>
              </div>
            </div>

            {exportStatus === "success" && (
              <div className="flex items-center justify-center p-4 bg-success/10 rounded-md border border-success text-success">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Export completed successfully!</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button className="w-full flex items-center justify-center" onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FilePdf className="h-4 w-4 mr-2" />}
            Export PDF
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleSendEDI}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Send to Payer (EDI-278)
          </Button>

          <Button variant="ghost" className="w-full flex items-center justify-center mt-4" onClick={handleStartNew}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start New Request
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
