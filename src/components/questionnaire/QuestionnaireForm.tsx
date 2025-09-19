'use client'

import React from 'react'
import { useQuestionnaireData } from '@/hooks/useQuestionnaireData'
import { useQuestionnaireForm } from '@/hooks/useQuestionnaireForm'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useFormSubmission } from '@/hooks/useFormSubmission'
import { StickyProgressBar } from './StickyProgressBar'
import { QuestionCard } from './QuestionCard'
import { ErrorDisplay } from './ErrorDisplay'
import { SubmissionSection } from './SubmissionSection'
import { AllQuestionsAnswered } from './AllQuestionsAnswered'
import type {
  QuestionnaireSchema,
  FormData,
  SubmissionResult,
  SubmissionResponse,
} from '@/lib/types/questionnaire'

interface QuestionnaireFormProps {
  questionnaire: QuestionnaireSchema
  onSubmit: (formData: FormData) => Promise<SubmissionResponse>
  onResults: (results: SubmissionResult) => void
  submitButtonText?: string
  loadingText?: string
}

export function QuestionnaireForm({
  questionnaire,
  onSubmit,
  onResults,
  submitButtonText = 'Enviar Respuestas',
  loadingText = 'Procesando...',
}: QuestionnaireFormProps) {
  const { displayedQuestions, getFilteredOptions, getInitialAnswers } =
    useQuestionnaireData(questionnaire)

  const { formData, handleInputChange } = useQuestionnaireForm({
    questionnaire,
    getInitialAnswers,
  })

  const { validateForm } = useFormValidation(questionnaire)
  const { isSubmitting, error, handleSubmit } = useFormSubmission({
    onSubmit,
    onResults,
    validateForm,
  })

  const completedQuestions = displayedQuestions.filter((q) => formData.answers[q.id]).length
  const totalQuestions = displayedQuestions.length
  const progressIndicatorId = 'progress-indicator'

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(formData)
  }

  return (
    <form onSubmit={onFormSubmit} className="space-y-8">
      <div id={progressIndicatorId} />

      <StickyProgressBar
        completed={completedQuestions}
        total={totalQuestions}
        progressIndicatorId={progressIndicatorId}
      />

      <div className="space-y-6">
        {totalQuestions === 0 ? (
          <AllQuestionsAnswered />
        ) : (
          displayedQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionIndex={index}
              value={formData.answers[question.id] || ''}
              options={getFilteredOptions(question)}
              onChange={(value) => handleInputChange(question.id, value)}
            />
          ))
        )}
      </div>

      {error && <ErrorDisplay error={error} />}

      <SubmissionSection
        isSubmitting={isSubmitting}
        submitButtonText={submitButtonText}
        loadingText={loadingText}
      />
    </form>
  )
}
