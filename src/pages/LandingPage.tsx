"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/hooks/useStore"
import { Combobox } from "@/components/ui/combobox"
import { Loader2 } from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const { setPatient, searchPatients } = useStore()
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [patientOptions, setPatientOptions] = useState<{ label: string; value: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Handle search input
  useEffect(() => {
    const search = async () => {
      setIsSearching(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const results = searchPatients(searchTerm)

      const options = results.map((patient) => ({
        label: `${patient.name} (${patient.mrn})`,
        value: patient.id,
      }))

      setPatientOptions(options)
      setIsSearching(false)
    }

    search()
  }, [searchTerm, searchPatients])

  const handleContinue = () => {
    const selectedPatient = searchPatients("").find((p) => p.id === selectedPatientId)
    if (selectedPatient) {
      setPatient(selectedPatient)
      navigate("/predict")
    }
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
          <CardTitle className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              AS
            </div>
            <span>AuthStream AI</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Patient</label>
            <div className="relative">
              <Combobox
                options={patientOptions}
                value={selectedPatientId}
                onValueChange={(value) => {
                  setSelectedPatientId(value)
                  // Trigger search on empty value to show all options
                  if (!value) setSearchTerm("")
                }}
                placeholder="Search patients..."
                className="w-full"
              />
              {isSearching && (
                <div className="absolute right-10 top-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={!selectedPatientId}>
            Start Authorization
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
