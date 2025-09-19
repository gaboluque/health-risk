'use client'

import React from 'react'
import { QuestionnaireContainer } from '@/components/questionnaire'
import { submitQuestionnaireByType } from '@/lib/actions/submit-questionnaire-by-type'
import { useUserProfile } from '@/contexts/UserProfileContext'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface ASCVDFormProps {
  questionnaire: QuestionnaireSchema
}

export function ASCVDForm({ questionnaire }: ASCVDFormProps) {
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
      submitButtonText="Calculate ASCVD Risk"
      loadingText="Calculating Risk..."
    />
  )
}
