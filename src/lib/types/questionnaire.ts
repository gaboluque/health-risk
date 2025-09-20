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
  level: number
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

export interface QuestionnaireUIMetadata {
  submitButtonText: string
  loadingText: string
  description: string
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
  chartColor?: string
  icon?: string
  displayCategory?: string
  color?: string
  bgColor?: string
  textColor?: string
  questions: QuestionnaireQuestion[]
  scoring: QuestionnaireScoring
  ui: QuestionnaireUIMetadata
  metadata: QuestionnaireMetadata
}

export interface FormData {
  firstName: string
  lastName: string
  email: string
  answers: Record<string, string>
}

// Standardized risk levels across all questionnaires
export enum StandardRiskLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  SEVERE = 'severe',
  UNKNOWN = 'unknown',
}

export interface RiskResult {
  score: number
  riskLevel: StandardRiskLevel
  riskValue: number
  riskDescription?: string
}

export interface SubmissionResult {
  submission: {
    id: string
    submittedBy: string // User ID
  }
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    isNewUser: boolean
  }
  riskResult: RiskResult
}

export interface SubmissionResponse {
  success: boolean
  data?: SubmissionResult
  error?: string
}
