import { useCallback } from 'react'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { submitQuestionnaireByType } from '@/lib/actions/submit-questionnaire-by-type'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

/**
 * Custom hook for handling questionnaire submissions
 * Provides consistent submission logic across all questionnaire components
 */
export function useQuestionnaireSubmission(questionnaire: QuestionnaireSchema) {
  const { profile } = useUserProfile()

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (!profile) {
        throw new Error('El perfil de usuario es requerido para enviar el cuestionario')
      }

      return submitQuestionnaireByType(questionnaire, formData, profile)
    },
    [questionnaire, profile],
  )

  return {
    handleSubmit,
    isProfileRequired: !profile,
    profile,
  }
}
