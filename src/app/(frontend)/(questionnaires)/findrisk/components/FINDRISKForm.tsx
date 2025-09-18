'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitFINDRISKQuestionnaire } from '../actions/submit-findrisk'
import { useUserProfile } from '@/contexts/UserProfileContext'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface FINDRISKFormProps {
  questionnaire: QuestionnaireSchema
}

export function FINDRISKForm({ questionnaire }: FINDRISKFormProps) {
  const { profile } = useUserProfile()

  const handleSubmit = async (formData: FormData) => {
    if (!profile) {
      throw new Error('User profile is required')
    }
    return submitFINDRISKQuestionnaire(questionnaire, formData, profile)
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
