// Mock data for the application

export type Patient = {
  id: string
  name: string
  dob: string
  mrn: string
  insurance: string
}

export type Order = {
  id: string
  cptCode: string
  icd10Code: string
  description: string
  requestedDate: string
}

export type SuggestionStatus = "success" | "warning" | "error"

export type Suggestion = {
  id: string
  rule: string
  status: SuggestionStatus
  confidence: number
  description: string
  evidence?: string
}

export type Note = {
  content: string
  highlights?: Array<{
    start: number
    end: number
    criteriaId: string
  }>
}

export type Prediction = {
  likelihood: number
  reasons: string[]
}

// Mock patients
export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    dob: "01/15/1975",
    mrn: "MRN12345",
    insurance: "Blue Cross",
  },
  {
    id: "2",
    name: "Jane Johnson",
    dob: "05/22/1982",
    mrn: "MRN23456",
    insurance: "Aetna",
  },
  {
    id: "3",
    name: "Robert Williams",
    dob: "11/30/1968",
    mrn: "MRN34567",
    insurance: "Medicare",
  },
  {
    id: "4",
    name: "Sarah Brown",
    dob: "08/12/1990",
    mrn: "MRN45678",
    insurance: "UnitedHealthcare",
  },
]

// Mock orders
export const mockOrders: Record<string, Order> = {
  "1": {
    id: "order1",
    cptCode: "73721",
    icd10Code: "M54.5",
    description: "MRI any joint of lower extremity",
    requestedDate: "2023-11-15",
  },
  "2": {
    id: "order2",
    cptCode: "99213",
    icd10Code: "J02.9",
    description: "Office visit, established patient",
    requestedDate: "2023-11-16",
  },
  "3": {
    id: "order3",
    cptCode: "29826",
    icd10Code: "M75.100",
    description: "Arthroscopy, shoulder, surgical",
    requestedDate: "2023-11-17",
  },
  "4": {
    id: "order4",
    cptCode: "77067",
    icd10Code: "Z12.31",
    description: "Screening mammography, bilateral",
    requestedDate: "2023-11-18",
  },
}

// Mock predictions
export const mockPredictions: Record<string, Prediction> = {
  "73721": {
    likelihood: 0.32,
    reasons: [
      "MRI requires additional documentation",
      "Conservative treatment not documented",
      "Duration of symptoms unclear",
    ],
  },
  "99213": {
    likelihood: 0.95,
    reasons: ["Office visit code is typically approved", "Diagnosis supports medical necessity"],
  },
  "29826": {
    likelihood: 0.45,
    reasons: [
      "Surgical procedure requires prior authorization",
      "Need documentation of failed conservative treatment",
      "Imaging results should be included",
    ],
  },
  "77067": {
    likelihood: 0.88,
    reasons: [
      "Preventive service with good coverage",
      "Patient age appropriate for screening",
      "Frequency of service within guidelines",
    ],
  },
}

// Mock clinical note
export const mockClinicalNote: Note = {
  content: `Patient presents with chronic lower back pain that has persisted for over 6 months. Pain is described as dull and aching, rated 7/10 on the pain scale. Pain radiates down the left leg. Patient has tried over-the-counter NSAIDs with minimal relief. Physical therapy was attempted for 4 weeks with no significant improvement. MRI shows L4-L5 disc herniation with nerve root compression. Patient is requesting referral to pain management specialist for epidural steroid injections.`,
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

// Mock suggestions
export const mockSuggestions: Suggestion[] = [
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
  {
    id: "s4",
    rule: "Missing documentation of symptom duration",
    status: "error",
    confidence: 40,
    description: "Need to clearly specify how long symptoms have been present",
  },
]

// Mock draft letter
export const mockDraftLetter = `
Dear Insurance Provider,

I am writing to request prior authorization for MRI of the lower extremity (CPT: 73721) for my patient, John Smith.

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
