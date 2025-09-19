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

  // Initialize form data with profile info and pre-filled answers
  const [formData, setFormData] = useState<FormData>(() => {
    const initialAnswers = getInitialAnswers()
    return {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      answers: initialAnswers,
    }
  })

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      const profileAnswers = getInitialAnswers()
      setFormData((prev) => ({
        ...prev,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        answers: { ...prev.answers, ...profileAnswers },
      }))
    }
  }, [profile, questionnaire, getInitialAnswers])

  const handleInputChange = useCallback((name: string, value: string) => {
    if (['firstName', 'lastName', 'email'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [name]: value,
        },
      }))
    }
  }, [])

  return {
    formData,
    handleInputChange,
  }
}
