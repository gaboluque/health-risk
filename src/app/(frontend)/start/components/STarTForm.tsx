'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitSTarTQuestionnaire } from '../actions/submit-start'
import { useUserProfile } from '@/contexts/UserProfileContext'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface STarTFormProps {
  questionnaire: QuestionnaireSchema
}

export function STarTForm({ questionnaire }: STarTFormProps) {
  const { profile } = useUserProfile()

  const handleSubmit = async (formData: FormData) => {
    if (!profile) {
      throw new Error('User profile is required')
    }
    return submitSTarTQuestionnaire(questionnaire, formData, profile)
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
