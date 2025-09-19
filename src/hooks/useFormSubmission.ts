import { useState, useCallback } from 'react'
import type { FormData, SubmissionResponse, SubmissionResult } from '@/lib/types/questionnaire'

interface UseFormSubmissionProps {
  onSubmit: (formData: FormData) => Promise<SubmissionResponse>
  onResults: (results: SubmissionResult) => void
  validateForm: (formData: FormData) => string | null
}

interface UseFormSubmissionReturn {
  isSubmitting: boolean
  error: string | null
  handleSubmit: (formData: FormData) => Promise<void>
  clearError: () => void
}

export function useFormSubmission({
  onSubmit,
  onResults,
  validateForm,
}: UseFormSubmissionProps): UseFormSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setIsSubmitting(true)
      setError(null)

      try {
        // Validate form data
        const validationError = validateForm(formData)
        if (validationError) {
          setError(validationError)
          return
        }

        // Submit form
        const result = await onSubmit(formData)

        if (result.success && result.data) {
          onResults(result.data)
          // Scroll to top to show results
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          setError(result.error || 'Ocurrió un error al enviar el cuestionario.')
        }
      } catch (err) {
        console.error('Submit error:', err)
        setError('Ocurrió un error inesperado. Por favor inténtalo de nuevo.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, onResults, validateForm],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isSubmitting,
    error,
    handleSubmit,
    clearError,
  }
}
