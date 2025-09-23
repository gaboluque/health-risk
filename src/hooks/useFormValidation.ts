import { useMemo } from 'react'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface UseFormValidationReturn {
  validateForm: (formData: FormData) => string | null
}

export function useFormValidation(questionnaire: QuestionnaireSchema): UseFormValidationReturn {
  const validateForm = useMemo(() => {
    return (formData: FormData): string | null => {
      // Validate required questions only (personal info is handled during login)
      const requiredQuestions = questionnaire.questions.filter((q) => q.required)
      const missingAnswers = requiredQuestions.filter((q) => !formData.answers[q.id])

      if (missingAnswers.length > 0) {
        const missingFields = missingAnswers.map((q) => q.description || q.label)
        return `Por favor completa las siguientes preguntas requeridas: ${missingFields.join(', ')}`
      }

      return null
    }
  }, [questionnaire.questions])

  return { validateForm }
}
