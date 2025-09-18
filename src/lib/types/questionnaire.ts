// Shared types for questionnaire system

export interface QuestionnaireOption {
  value: string
  label: string
}

export interface QuestionnaireQuestion {
  id: string
  type: string
  label: string
  description: string
  required: boolean
  options: QuestionnaireOption[]
}

export interface RiskCategory {
  name: string
  range: {
    min: number
    max: number
  }
  color: string
  description: string
  recommendations?: string[]
}

export interface QuestionnaireReference {
  title: string
  url: string
}

export interface QuestionnaireScoring {
  algorithm: string
  output: {
    type: string
    label: string
    unit: string
    precision: number
  }
  riskCategories: RiskCategory[]
}

export interface QuestionnaireMetadata {
  createdAt: string
  clinicalUse: string
}

export interface QuestionnaireSchema {
  id: string
  name: string
  description: string
  patientFriendlyName?: string
  patientFriendlyDescription?: string
  version: string
  category: string
  questions: QuestionnaireQuestion[]
  scoring: QuestionnaireScoring
  metadata: QuestionnaireMetadata
}

export interface FormData {
  firstName: string
  lastName: string
  email: string
  answers: Record<string, string>
}

export interface RiskResult {
  score: number
  risk: string
}

export interface SubmissionResult {
  submission: {
    id: string
    submittedBy: {
      firstName: string
      lastName: string
      email: string
    }
  }
  riskResult: RiskResult
}

export interface SubmissionResponse {
  success: boolean
  data?: SubmissionResult
  error?: string
}
