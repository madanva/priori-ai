"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Combobox } from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/store"

// Mock patient data
const patients = [
  {
    label: "John Doe, 45M (MRN: 12345)",
    value: "1",
    data: { id: "1", name: "John Doe", dob: "05/12/1978", mrn: "12345", insurance: "Blue Cross" },
  },
  {
    label: "Jane Smith, 62F (MRN: 23456)",
    value: "2",
    data: { id: "2", name: "Jane Smith", dob: "09/23/1961", mrn: "23456", insurance: "Medicare" },
  },
  {
    label: "Robert Johnson, 38M (MRN: 34567)",
    value: "3",
    data: { id: "3", name: "Robert Johnson", dob: "11/05/1985", mrn: "34567", insurance: "Aetna" },
  },
  {
    label: "Maria Garcia, 55F (MRN: 45678)",
    value: "4",
    data: {
      id: "4",
      name: "Maria Garcia",
      dob: "03/17/1968",
      mrn: "45678",
      insurance: "United Healthcare' } },b: '03/17/1968",
      mrn: "45678",
      insurance: "United Healthcare",
    },
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { setPatient } = useStore()
  const [selectedPatient, setSelectedPatient] = useState<string>("")

  const handleContinue = () => {
    const patient = patients.find((p) => p.value === selectedPatient)?.data
    if (patient) {
      setPatient(patient)
      navigate("/upload")
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
            <img
              src="/assets/clinic-logo.svg"
              alt="Clinic Logo"
              className="h-16 mx-auto mb-4"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23087E8B" /><text x="50%" y="50%" fontFamily="Arial" fontSize="24" fill="white" textAnchor="middle" dominantBaseline="middle">Clinic</text></svg>'
              }}
            />
            <span>PriorAI</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Patient</label>
            <Combobox
              options={patients}
              value={selectedPatient}
              onValueChange={setSelectedPatient}
              placeholder="Search patients..."
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={!selectedPatient}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
