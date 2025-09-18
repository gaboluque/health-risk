'use client'

import React, { useState } from 'react'
import { QuestionnaireForm } from './QuestionnaireForm'
import { QuestionnaireResults } from './QuestionnaireResults'
import type {
  QuestionnaireSchema,
  SubmissionResult,
  SubmissionResponse,
  FormData,
} from '@/lib/types/questionnaire'

interface QuestionnaireContainerProps {
  questionnaire: QuestionnaireSchema
  onSubmit: (formData: FormData) => Promise<SubmissionResponse>
  submitButtonText?: string
  loadingText?: string
  customActions?: React.ReactNode
}

export function QuestionnaireContainer({
  questionnaire,
  onSubmit,
  submitButtonText,
  loadingText,
  customActions,
}: QuestionnaireContainerProps) {
  const [results, setResults] = useState<SubmissionResult | null>(null)

  const handleResults = (submissionResult: SubmissionResult) => {
    setResults(submissionResult)
  }

  const handleStartOver = () => {
    setResults(null)
  }

  if (results) {
    return (
      <QuestionnaireResults
        questionnaire={questionnaire}
        results={results}
        onStartOver={handleStartOver}
        customActions={customActions}
      />
    )
  }

  return (
    <QuestionnaireForm
      questionnaire={questionnaire}
      onSubmit={onSubmit}
      onResults={handleResults}
      submitButtonText={submitButtonText}
      loadingText={loadingText}
    />
  )
}
