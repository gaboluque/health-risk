/**
 * StandardQuestionnaireForm - Base component for all questionnaire forms
 *
 * This component provides a consistent interface and behavior for all questionnaire types.
 * It handles:
 * - User profile validation
 * - Questionnaire submission logic
 * - Loading states and error handling
 * - Consistent UI text and styling
 *
 * @example
 * ```tsx
 * export function ASCVDForm({ questionnaire }: { questionnaire: QuestionnaireSchema }) {
 *   return <StandardQuestionnaireForm questionnaire={questionnaire} />
 * }
 * ```
 */

'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { useQuestionnaireSubmission } from '@/hooks/useQuestionnaireSubmission'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

export interface StandardQuestionnaireFormProps {
  questionnaire: QuestionnaireSchema
}

export function StandardQuestionnaireForm({ questionnaire }: StandardQuestionnaireFormProps) {
  const { handleSubmit } = useQuestionnaireSubmission(questionnaire)

  const finalSubmitButtonText = questionnaire.ui.submitButtonText
  const finalLoadingText = questionnaire.ui.loadingText

  return (
    <QuestionnaireContainer
      questionnaire={questionnaire}
      onSubmit={handleSubmit}
      submitButtonText={finalSubmitButtonText}
      loadingText={finalLoadingText}
    />
  )
}
