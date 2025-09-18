'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitFRAXQuestionnaire } from '../actions/submit-frax'
import { useUserProfile } from '@/contexts/UserProfileContext'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface FRAXFormProps {
  questionnaire: QuestionnaireSchema
}

export function FRAXForm({ questionnaire }: FRAXFormProps) {
  const { profile } = useUserProfile()

  const handleSubmit = async (formData: FormData) => {
    if (!profile) {
      throw new Error('User profile is required')
    }
    return submitFRAXQuestionnaire(questionnaire, formData, profile)
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
