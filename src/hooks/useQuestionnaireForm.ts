import { useState, useEffect, useCallback } from 'react'
import { useUserProfile } from '@/contexts/UserProfileContext'
import type { FormData, QuestionnaireSchema } from '@/lib/types/questionnaire'

interface UseQuestionnaireFormProps {
  questionnaire: QuestionnaireSchema
  getInitialAnswers: () => Record<string, string>
}

interface UseQuestionnaireFormReturn {
  formData: FormData
  handleInputChange: (name: string, value: string) => void
}

export function useQuestionnaireForm({
  questionnaire,
  getInitialAnswers,
}: UseQuestionnaireFormProps): UseQuestionnaireFormReturn {
  const { profile } = useUserProfile()

  // Initialize form data with pre-filled answers (personal info is handled by UserProfile context)
  const [formData, setFormData] = useState<FormData>(() => {
    const initialAnswers = getInitialAnswers()
    return {
      answers: initialAnswers,
    }
  })

  // Update form data when profile changes (only affects pre-filled questionnaire answers)
  useEffect(() => {
    if (profile) {
      const profileAnswers = getInitialAnswers()
      setFormData((prev) => ({
        answers: { ...prev.answers, ...profileAnswers },
      }))
    }
  }, [profile, questionnaire, getInitialAnswers])

  const handleInputChange = useCallback((name: string, value: string) => {
    // Only handle questionnaire answers (personal info is handled by profile context)
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [name]: value,
      },
    }))
  }, [])

  return {
    formData,
    handleInputChange,
  }
}
