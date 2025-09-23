'use client'

import React, { useState } from 'react'
import { QuestionnaireForm } from './QuestionnaireForm'
import { QuestionnaireResults } from './QuestionnaireResults'
import { ErrorBoundary } from '../common/ErrorBoundary'
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setResults(null)
  }

  return (
    <ErrorBoundary onReset={handleStartOver}>
      {results ? (
        <QuestionnaireResults
          questionnaire={questionnaire}
          results={results}
          onStartOver={handleStartOver}
          customActions={customActions}
        />
      ) : (
        <QuestionnaireForm
          questionnaire={questionnaire}
          onSubmit={onSubmit}
          onResults={handleResults}
          submitButtonText={submitButtonText}
          loadingText={loadingText}
        />
      )}
    </ErrorBoundary>
  )
}
