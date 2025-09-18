'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitFINDRISKQuestionnaire } from '../actions/submit-findrisk'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface FINDRISKFormProps {
  questionnaire: QuestionnaireSchema
}

export function FINDRISKForm({ questionnaire }: FINDRISKFormProps) {
  const handleSubmit = async (formData: FormData) => {
    return submitFINDRISKQuestionnaire(questionnaire, formData)
  }

  return (
    <QuestionnaireContainer
      questionnaire={questionnaire}
      onSubmit={handleSubmit}
      submitButtonText="Calculate Diabetes Risk"
      loadingText="Calculating Risk..."
    />
  )
}
