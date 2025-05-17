"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import FHIR from "fhirclient"
import type Client from "fhirclient/lib/Client"
import type { fhir } from "@andes/noxo-fhir/dist/src/models/fhir"

interface FhirContextType {
  client: Client | null
  isLoading: boolean
  error: Error | null
  ready: boolean
  initialize: () => Promise<void>
}

const FhirContext = createContext<FhirContextType>({
  client: null,
  isLoading: true,
  error: null,
  ready: false,
  initialize: async () => {},
})

export const FhirClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [ready, setReady] = useState(false)

  const initialize = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if we're in demo mode
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO === "true") {
        // In demo mode, we'll use a mock client
        console.log("Running in demo mode, using mock FHIR client")

        // Wait a bit to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create a mock client with minimal functionality
        const mockClient = {
          patient: {
            read: async () => {
              return {
                resourceType: "Patient",
                id: "example",
                name: [
                  {
                    use: "official",
                    family: "Doe",
                    given: ["John"],
                  },
                ],
                gender: "male",
                birthDate: "1970-01-01",
              }
            },
            request: async () => {
              // Mock implementation
              return {} as any
            },
          },
          request: async () => {
            // Mock implementation
            return {} as any
          },
        } as unknown as Client

        setClient(mockClient as Client)
        setReady(true)
      } else {
        // In production mode, initialize the real FHIR client
        const fhirClient = await FHIR.oauth2.ready()
        setClient(fhirClient)
        setReady(true)
      }
    } catch (err) {
      console.error("Error initializing FHIR client:", err)
      setError(err instanceof Error ? err : new Error("Unknown error initializing FHIR client"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Auto-initialize on mount
    initialize()
  }, [])

  return <FhirContext.Provider value={{ client, isLoading, error, ready, initialize }}>{children}</FhirContext.Provider>
}

export const useFhirClient = () => useContext(FhirContext)

// Helper hook to search for patients
export const usePatientSearch = () => {
  const { client } = useFhirClient()
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<fhir.Patient[]>([])
  const [searchError, setSearchError] = useState<Error | null>(null)

  const searchPatients = async (searchTerm: string) => {
    if (!client) return

    setIsSearching(true)
    setSearchError(null)

    try {
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO === "true") {
        // In demo mode, return mock patients
        await new Promise((resolve) => setTimeout(resolve, 300))

        const mockPatients: fhir.Patient[] = [
          {
            resourceType: "Patient",
            id: "1",
            name: [{ family: "Smith", given: ["John"] }],
            gender: "male",
            birthDate: "1970-01-01",
          },
          {
            resourceType: "Patient",
            id: "2",
            name: [{ family: "Johnson", given: ["Jane"] }],
            gender: "female",
            birthDate: "1985-05-15",
          },
          {
            resourceType: "Patient",
            id: "3",
            name: [{ family: "Williams", given: ["Robert"] }],
            gender: "male",
            birthDate: "1962-11-30",
          },
          {
            resourceType: "Patient",
            id: "4",
            name: [{ family: "Brown", given: ["Sarah"] }],
            gender: "female",
            birthDate: "1990-08-22",
          },
        ]

        // Filter mock patients based on search term
        const filteredPatients = mockPatients.filter((patient) => {
          const fullName = `${patient.name?.[0]?.given?.[0] || ""} ${patient.name?.[0]?.family || ""}`.toLowerCase()
          return fullName.includes(searchTerm.toLowerCase())
        })

        setSearchResults(filteredPatients)
      } else {
        // In production mode, search real patients
        const response = await client.request(`Patient?name=${searchTerm}&_count=10`)
        setSearchResults(response.entry?.map((entry: any) => entry.resource) || [])
      }
    } catch (err) {
      console.error("Error searching patients:", err)
      setSearchError(err instanceof Error ? err : new Error("Unknown error searching patients"))
    } finally {
      setIsSearching(false)
    }
  }

  return { searchPatients, isSearching, searchResults, searchError }
}

// Helper hook to get CDS Hooks context
export const useCDSHooksContext = () => {
  const { client } = useFhirClient()
  const [cdsContext, setCdsContext] = useState<any>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const [contextError, setContextError] = useState<Error | null>(null)

  useEffect(() => {
    const loadContext = async () => {
      if (!client) return

      setIsLoadingContext(true)
      setContextError(null)

      try {
        if (import.meta.env.DEV || import.meta.env.VITE_DEMO === "true") {
          // In demo mode, return mock CDS Hooks context
          await new Promise((resolve) => setTimeout(resolve, 300))

          const mockContext = {
            hookInstance: "123",
            hook: "order-select",
            context: {
              patientId: "1",
              encounterId: "enc1",
              selections: [
                {
                  resourceType: "DeviceRequest",
                  id: "dev1",
                  status: "draft",
                  intent: "order",
                  codeCodeableConcept: {
                    coding: [
                      {
                        system: "http://www.ama-assn.org/go/cpt",
                        code: "73721",
                        display: "MRI any joint of lower extremity",
                      },
                    ],
                  },
                  reasonCode: [
                    {
                      coding: [
                        {
                          system: "http://hl7.org/fhir/sid/icd-10-cm",
                          code: "M54.5",
                          display: "Low back pain",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          }

          setCdsContext(mockContext)
        } else {
          // In production mode, get real CDS Hooks context
          // This would typically come from the launch context or URL parameters
          // For now, we'll just use a mock
          setCdsContext(null)
        }
      } catch (err) {
        console.error("Error loading CDS Hooks context:", err)
        setContextError(err instanceof Error ? err : new Error("Unknown error loading CDS Hooks context"))
      } finally {
        setIsLoadingContext(false)
      }
    }

    loadContext()
  }, [client])

  return { cdsContext, isLoadingContext, contextError }
}
