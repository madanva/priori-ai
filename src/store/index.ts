import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type Patient = {
  id: string
  name: string
  dob: string
  mrn: string
  insurance: string
}

export type CriteriaStatus = "success" | "warning" | "error"

export type Criteria = {
  id: string
  rule: string
  status: CriteriaStatus
  confidence: number
  evidence?: string
}

export type Note = {
  id: string
  content: string
  highlights?: Array<{
    start: number
    end: number
    criteriaId: string
  }>
}

export type ExportStatus = "idle" | "generating" | "success" | "error"

interface PriorAIState {
  patient: Patient | null
  note: Note | null
  criteria: Criteria[]
  draft: string
  exportStatus: ExportStatus
  isOnline: boolean

  // Actions
  setPatient: (patient: Patient | null) => void
  setNote: (note: Note | null) => void
  setCriteria: (criteria: Criteria[]) => void
  updateCriteria: (criteriaId: string, updates: Partial<Criteria>) => void
  setDraft: (draft: string) => void
  setExportStatus: (status: ExportStatus) => void
  setIsOnline: (isOnline: boolean) => void
  resetState: () => void
}

const initialState = {
  patient: null,
  note: null,
  criteria: [],
  draft: "",
  exportStatus: "idle" as ExportStatus,
  isOnline: navigator.onLine,
}

export const useStore = create<PriorAIState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setPatient: (patient) => set({ patient }),

        setNote: (note) => set({ note }),

        setCriteria: (criteria) => set({ criteria }),

        updateCriteria: (criteriaId, updates) =>
          set((state) => ({
            criteria: state.criteria.map((c) => (c.id === criteriaId ? { ...c, ...updates } : c)),
          })),

        setDraft: (draft) => set({ draft }),

        setExportStatus: (exportStatus) => set({ exportStatus }),

        setIsOnline: (isOnline) => set({ isOnline }),

        resetState: () => set(initialState),
      }),
      {
        name: "prior-ai-storage",
        partialize: (state) => ({
          patient: state.patient,
          note: state.note,
          criteria: state.criteria,
          draft: state.draft,
        }),
      },
    ),
  ),
)
