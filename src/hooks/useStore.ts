import { create } from "zustand"
import {
  mockPatients,
  mockOrders,
  mockPredictions,
  mockClinicalNote,
  mockSuggestions,
  mockDraftLetter,
  type Patient,
  type Order,
  type Prediction,
  type Note,
  type Suggestion,
} from "@/lib/mockData"

export type ExportStatus = "idle" | "generating" | "success" | "error"

interface AuthStreamState {
  patient: Patient | null
  order: Order | null
  note: Note | null
  prediction: Prediction | null
  suggestions: Suggestion[]
  draft: string
  exportStatus: ExportStatus
  isOnline: boolean

  // Actions
  setPatient: (patient: Patient | null) => void
  setOrder: (order: Order | null) => void
  setNote: (note: Note | null) => void
  setPrediction: (prediction: Prediction | null) => void
  setSuggestions: (suggestions: Suggestion[]) => void
  updateSuggestion: (suggestionId: string, updates: Partial<Suggestion>) => void
  setDraft: (draft: string) => void
  setExportStatus: (status: ExportStatus) => void
  setIsOnline: (isOnline: boolean) => void
  resetState: () => void

  // Mock data helpers
  searchPatients: (query: string) => Patient[]
  getOrderForPatient: (patientId: string) => Order
  getPredictionForOrder: (cptCode: string) => Prediction
}

const initialState = {
  patient: null,
  order: null,
  note: null,
  prediction: null,
  suggestions: [],
  draft: "",
  exportStatus: "idle" as ExportStatus,
  isOnline: navigator.onLine,
}

export const useStore = create<AuthStreamState>((set, get) => ({
  ...initialState,

  setPatient: (patient) => {
    set({ patient })
    // Auto-set order when patient is selected (for demo)
    if (patient) {
      const order = mockOrders[patient.id]
      set({ order })
    }
  },

  setOrder: (order) => set({ order }),

  setNote: (note) => set({ note }),

  setPrediction: (prediction) => set({ prediction }),

  setSuggestions: (suggestions) => set({ suggestions }),

  updateSuggestion: (suggestionId, updates) =>
    set((state) => ({
      suggestions: state.suggestions.map((s) => (s.id === suggestionId ? { ...s, ...updates } : s)),
    })),

  setDraft: (draft) => set({ draft }),

  setExportStatus: (exportStatus) => set({ exportStatus }),

  setIsOnline: (isOnline) => set({ isOnline }),

  resetState: () => set(initialState),

  // Mock data helpers
  searchPatients: (query: string) => {
    if (!query) return mockPatients
    const lowerQuery = query.toLowerCase()
    return mockPatients.filter(
      (patient) => patient.name.toLowerCase().includes(lowerQuery) || patient.mrn.toLowerCase().includes(lowerQuery),
    )
  },

  getOrderForPatient: (patientId: string) => {
    return mockOrders[patientId] || mockOrders["1"] // Default to first order
  },

  getPredictionForOrder: (cptCode: string) => {
    return (
      mockPredictions[cptCode] || {
        likelihood: 0.5,
        reasons: ["Generic prediction for unknown CPT code"],
      }
    )
  },
}))

// Initialize with mock data for demo purposes
export function initializeMockData() {
  const store = useStore.getState()

  // Don't initialize if already has data
  if (store.note || store.suggestions.length > 0) return

  store.setNote(mockClinicalNote)
  store.setSuggestions(mockSuggestions)
  store.setDraft(mockDraftLetter)
}
