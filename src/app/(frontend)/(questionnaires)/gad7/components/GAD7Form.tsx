'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitQuestionnaireByType } from '@/lib/actions/submit-questionnaire-by-type'
import { useUserProfile } from '@/contexts/UserProfileContext'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface GAD7FormProps {
  questionnaire: QuestionnaireSchema
}

export function GAD7Form({ questionnaire }: GAD7FormProps) {
  const { profile } = useUserProfile()

  const handleSubmit = async (formData: FormData) => {
    if (!profile) {
      throw new Error('User profile is required')
    }
    return submitQuestionnaireByType(questionnaire, formData, profile)
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
