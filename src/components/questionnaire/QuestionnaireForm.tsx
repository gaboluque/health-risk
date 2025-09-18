'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { mapProfileToAnswers, getProfileAnsweredQuestions } from '@/lib/utils/profile-mapping'
import type {
  QuestionnaireSchema,
  FormData,
  SubmissionResult,
  SubmissionResponse,
  QuestionnaireQuestion,
  QuestionnaireOption,
} from '@/lib/types/questionnaire'

interface QuestionnaireFormProps {
  questionnaire: QuestionnaireSchema
  onSubmit: (formData: FormData) => Promise<SubmissionResponse>
  onResults: (results: SubmissionResult) => void
  submitButtonText?: string
  loadingText?: string
}

export function QuestionnaireForm({
  questionnaire,
  onSubmit,
  onResults,
  submitButtonText = 'Enviar Respuestas',
  loadingText = 'Procesando...',
}: QuestionnaireFormProps) {
  const { profile } = useUserProfile()

  // Initialize form data with profile info and pre-filled answers
  const [formData, setFormData] = useState<FormData>(() => {
    const initialAnswers = profile ? mapProfileToAnswers(profile, questionnaire) : {}
    return {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      answers: initialAnswers,
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get questions that are answered by profile
  const profileAnsweredQuestions = profile
    ? getProfileAnsweredQuestions(profile, questionnaire)
    : new Set()

  // Filter out questions that are answered by profile
  const displayedQuestions = questionnaire.questions.filter(
    (question) => !profileAnsweredQuestions.has(question.id),
  )

  // Filter question options based on profile data (e.g., sex-specific options)
  const getFilteredOptions = (question: QuestionnaireQuestion): QuestionnaireOption[] => {
    // Filter waist circumference options based on user's sex
    if (question.id === 'waist_circumference' && profile?.sex) {
      const userSex = profile.sex.toLowerCase()
      return question.options.filter((option: QuestionnaireOption) => {
        const optionValue = option.value.toLowerCase()
        // Show only options that match the user's sex
        if (userSex === 'male') {
          return optionValue.startsWith('male_')
        } else if (userSex === 'female') {
          return optionValue.startsWith('female_')
        }
        // If sex is not male/female, show all options
        return true
      })
    }

    // Return all options for other questions
    return question.options
  }

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      const profileAnswers = mapProfileToAnswers(profile, questionnaire)
      setFormData((prev) => ({
        ...prev,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        answers: { ...prev.answers, ...profileAnswers },
      }))
    }
  }, [profile, questionnaire])

  // Handle sticky progress bar
  useEffect(() => {
    const handleScroll = () => {
      const progressIndicator = document.getElementById('progress-indicator')
      const stickyProgress = document.getElementById('sticky-progress')

      if (!progressIndicator || !stickyProgress) return

      const progressRect = progressIndicator.getBoundingClientRect()
      const isProgressVisible = progressRect.bottom > 0

      if (!isProgressVisible) {
        // Show sticky progress bar
        stickyProgress.classList.remove('-translate-y-full', 'opacity-0')
        stickyProgress.classList.add('translate-y-0', 'opacity-100')
      } else {
        // Hide sticky progress bar
        stickyProgress.classList.remove('translate-y-0', 'opacity-100')
        stickyProgress.classList.add('-translate-y-full', 'opacity-0')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleInputChange = (name: string, value: string) => {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate all required fields are filled
      const missingFields = []

      if (!formData.firstName.trim()) missingFields.push('Nombre')
      if (!formData.lastName.trim()) missingFields.push('Apellido')
      if (!formData.email.trim()) missingFields.push('Correo electrónico')

      const requiredQuestions = questionnaire.questions.filter((q) => q.required)
      const missingAnswers = requiredQuestions.filter((q) => !formData.answers[q.id])

      if (missingAnswers.length > 0) {
        missingFields.push(...missingAnswers.map((q) => q.description || q.label))
      }

      if (missingFields.length > 0) {
        setError(`Por favor completa los siguientes campos requeridos: ${missingFields.join(', ')}`)
        return
      }

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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Indicator */}
      <div id="progress-indicator"></div>

      {/* Sticky Progress Bar */}
      <div
        className="fixed top-[70px] left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 transition-all duration-300 transform -translate-y-full opacity-0"
        id="sticky-progress"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900">
                  {displayedQuestions.filter((q) => formData.answers[q.id]).length} of{' '}
                  {displayedQuestions.length} completed
                </span>
              </div>
            </div>
            <div className="flex-1 mx-6">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${displayedQuestions.length > 0 ? (displayedQuestions.filter((q) => formData.answers[q.id]).length / displayedQuestions.length) * 100 : 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="text-sm font-bold text-blue-600">
              {Math.round(
                displayedQuestions.length > 0
                  ? (displayedQuestions.filter((q) => formData.answers[q.id]).length /
                      displayedQuestions.length) *
                      100
                  : 100,
              )}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        {displayedQuestions.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">All Questions Answered!</h3>
                <p className="text-sm text-green-700">
                  Your profile information has answered all the questions for this assessment. You
                  can submit directly.
                </p>
              </div>
            </div>
          </div>
        ) : (
          displayedQuestions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-slate-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor={question.id}
                        className="text-base font-semibold text-slate-700 block"
                      >
                        {question.description || question.label}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <ToggleGroup
                  type="single"
                  value={formData.answers[question.id] || ''}
                  onValueChange={(value) => {
                    if (value) {
                      handleInputChange(question.id, value)
                    }
                  }}
                  className="flex-col items-stretch gap-3 w-full"
                  variant="outline"
                >
                  {getFilteredOptions(question).map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className="justify-start text-left p-4 h-auto min-h-[3rem] whitespace-normal break-words transition-all duration-200 data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:text-blue-900 data-[state=on]:shadow-md hover:bg-slate-50 hover:border-slate-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center w-full">
                        <div className="flex-shrink-0 w-4 h-4 mr-3 rounded-full border-2 border-slate-300 transition-colors duration-200 flex items-center justify-center">
                          {formData.answers[question.id] === option.value && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="text-sm leading-relaxed font-medium text-slate-700">
                          {option.label}
                        </span>
                      </div>
                      {formData.answers[question.id] === option.value && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Please check the following:</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900">
              ¿Listo para ver tus resultados?
            </h4>
            <p className="text-xs text-slate-600">
              Asegúrate de que todos los campos requeridos estén completos
            </p>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {loadingText}
              </div>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
