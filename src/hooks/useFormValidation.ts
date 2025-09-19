import { useMemo } from 'react'
import type { QuestionnaireSchema, FormData } from '@/lib/types/questionnaire'

interface UseFormValidationReturn {
  validateForm: (formData: FormData) => string | null
}

export function useFormValidation(questionnaire: QuestionnaireSchema): UseFormValidationReturn {
  const validateForm = useMemo(() => {
    return (formData: FormData): string | null => {
      const missingFields: string[] = []

      // Validate personal information
      if (!formData.firstName.trim()) missingFields.push('Nombre')
      if (!formData.lastName.trim()) missingFields.push('Apellido')
      if (!formData.email.trim()) missingFields.push('Correo electrónico')

      // Validate required questions
      const requiredQuestions = questionnaire.questions.filter((q) => q.required)
      const missingAnswers = requiredQuestions.filter((q) => !formData.answers[q.id])

      if (missingAnswers.length > 0) {
        missingFields.push(...missingAnswers.map((q) => q.description || q.label))
      }

      if (missingFields.length > 0) {
        return `Por favor completa los siguientes campos requeridos: ${missingFields.join(', ')}`
      }

      return null
    }
  }, [questionnaire.questions])

  return { validateForm }
}
