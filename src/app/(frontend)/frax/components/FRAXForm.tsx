'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitFRAXQuestionnaire } from '../actions/submit-frax'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface FRAXFormProps {
  questionnaire: QuestionnaireSchema
}

export function FRAXForm({ questionnaire }: FRAXFormProps) {
  const handleSubmit = async (formData: FormData) => {
    return submitFRAXQuestionnaire(questionnaire, formData)
  }

  return (
    <QuestionnaireContainer
      questionnaire={questionnaire}
      onSubmit={handleSubmit}
      submitButtonText="Calculate Fracture Risk"
      loadingText="Calculating Risk..."
    />
  )
}
