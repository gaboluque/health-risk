'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitGAD7Questionnaire } from '../actions/submit-gad7'
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
    return submitGAD7Questionnaire(questionnaire, formData, profile)
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
