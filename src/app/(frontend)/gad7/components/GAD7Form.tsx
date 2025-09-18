'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitGAD7Questionnaire } from '../actions/submit-gad7'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface GAD7FormProps {
  questionnaire: QuestionnaireSchema
}

export function GAD7Form({ questionnaire }: GAD7FormProps) {
  const handleSubmit = async (formData: FormData) => {
    return submitGAD7Questionnaire(questionnaire, formData)
  }

  return (
    <QuestionnaireContainer
      questionnaire={questionnaire}
      onSubmit={handleSubmit}
      submitButtonText="Calculate Anxiety Level"
      loadingText="Calculating Score..."
    />
  )
}
