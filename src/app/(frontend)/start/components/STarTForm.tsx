'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitSTarTQuestionnaire } from '../actions/submit-start'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface STarTFormProps {
  questionnaire: QuestionnaireSchema
}

export function STarTForm({ questionnaire }: STarTFormProps) {
  const handleSubmit = async (formData: FormData) => {
    return submitSTarTQuestionnaire(questionnaire, formData)
  }

  return (
    <QuestionnaireContainer
      questionnaire={questionnaire}
      onSubmit={handleSubmit}
      submitButtonText="Calculate Back Pain Risk"
      loadingText="Calculating Risk..."
    />
  )
}
