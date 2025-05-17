// API stubs for when process.env.DEMO === 'true'
import type { Order, Suggestion } from "@/hooks/useStore"

export interface PredictionResult {
  likelihood: number
  reasons: string[]
}

export interface SuggestionResult {
  suggestions: Suggestion[]
  noteExcerpt: string
  highlights: Array<{
    start: number
    end: number
    criteriaId: string
  }>
}

export const api = {
  predict: async (order: Order): Promise<PredictionResult> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response based on CPT code
    const cptCode = order.cptCode

    if (cptCode === "99213") {
      return {
        likelihood: 0.95,
        reasons: ["Office visit code is typically approved", "Diagnosis supports medical necessity"],
      }
    } else if (cptCode === "73721") {
      return {
        likelihood: 0.32,
        reasons: [
          "MRI requires additional documentation",
          "Conservative treatment not documented",
          "Duration of symptoms unclear",
        ],
      }
    } else {
      return {
        likelihood: 0.65,
        reasons: ["Moderate approval likelihood", "Additional documentation may be required"],
      }
    }
  },

  suggest: async (order: Order, note: string): Promise<SuggestionResult> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock response
    return {
      noteExcerpt:
        note ||
        "Patient presents with chronic lower back pain that has persisted for over 6 months. Pain is described as dull and aching, rated 7/10 on the pain scale. Pain radiates down the left leg. Patient has tried over-the-counter NSAIDs with minimal relief. Physical therapy was attempted for 4 weeks with no significant improvement. MRI shows L4-L5 disc herniation with nerve root compression.",
      suggestions: [
        {
          id: "s1",
          rule: "Document failed conservative treatment",
          status: "warning",
          confidence: 70,
          description: "Need to document at least 6 weeks of conservative treatment",
        },
        {
          id: "s2",
          rule: "Specify functional limitations",
          status: "error",
          confidence: 30,
          description: "Document how pain affects activities of daily living",
        },
        {
          id: "s3",
          rule: "Include physical exam findings",
          status: "warning",
          confidence: 60,
          description: "Document relevant physical examination findings",
        },
      ],
      highlights: [
        {
          start: 28,
          end: 65,
          criteriaId: "s1",
        },
        {
          start: 150,
          end: 180,
          criteriaId: "s3",
        },
      ],
    }
  },

  generateDraft: async (data: { patient: any; order: Order; suggestions: Suggestion[] }): Promise<string> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Mock response
    return `
Dear Insurance Provider,

I am writing to request prior authorization for ${data.order.description} (CPT: ${data.order.cptCode}) for my patient, ${data.patient?.name?.given?.[0] || "John"} ${data.patient?.name?.family || "Doe"}.

Clinical Summary:
The patient presents with chronic lower back pain that has persisted for over 6 months. The pain is described as dull and aching, rated 7/10 on the pain scale. The pain radiates down the left leg, consistent with radiculopathy.

Treatment History:
The patient has tried conservative management including:
- Over-the-counter NSAIDs with minimal relief
- Physical therapy for 4 weeks with no significant improvement

Diagnostic Findings:
MRI of the lumbar spine shows L4-L5 disc herniation with nerve root compression, which correlates with the patient's symptoms.

Functional Limitations:
The patient reports difficulty with prolonged sitting, standing, and walking. These limitations affect their ability to perform daily activities and work responsibilities.

Based on the patient's clinical presentation, failed conservative treatment, and diagnostic findings, the requested procedure is medically necessary to alleviate pain, improve function, and potentially avoid more invasive interventions.

Thank you for your consideration of this request. Please feel free to contact our office if you require any additional information.

Sincerely,
Dr. Smith
    `.trim()
  },

  exportPdf: async (draft: string): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, this would generate and download a PDF
    console.log("Exporting PDF with content:", draft)

    // Create a simple text file download as a placeholder
    const blob = new Blob([draft], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "prior_authorization_letter.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
}

// Create a window.api object for compatibility
declare global {
  interface Window {
    api: typeof api
  }
}

// Only set window.api in development or when DEMO is true
if (import.meta.env.DEV || import.meta.env.VITE_DEMO === "true") {
  window.api = api
}

export default api
