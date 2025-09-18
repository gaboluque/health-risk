'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type {
  QuestionnaireSchema,
  FormData,
  SubmissionResult,
  SubmissionResponse,
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
  submitButtonText = 'Submit Assessment',
  loadingText = 'Processing...',
}: QuestionnaireFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    answers: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      if (!formData.firstName.trim()) missingFields.push('First Name')
      if (!formData.lastName.trim()) missingFields.push('Last Name')
      if (!formData.email.trim()) missingFields.push('Email')

      const requiredQuestions = questionnaire.questions.filter((q) => q.required)
      const missingAnswers = requiredQuestions.filter((q) => !formData.answers[q.id])

      if (missingAnswers.length > 0) {
        missingFields.push(...missingAnswers.map((q) => q.label))
      }

      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.join(', ')}`)
        return
      }

      const result = await onSubmit(formData)

      if (result.success && result.data) {
        onResults(result.data)
      } else {
        setError(result.error || 'An error occurred while submitting the questionnaire.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-blue-900">Progress</span>
          <span className="text-sm font-medium text-blue-900">
            {Object.keys(formData.answers).length} / {questionnaire.questions.length}
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(Object.keys(formData.answers).length / questionnaire.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
          Health Assessment
        </h3>
        {questionnaire.questions.map((question) => (
          <div
            key={question.id}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
          >
            <div className="mb-4">
              <Label htmlFor={question.id} className="text-lg font-semibold text-gray-900 block">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {question.description && (
                <p className="text-sm text-gray-600 mt-2">{question.description}</p>
              )}
            </div>

            <ToggleGroup
              type="single"
              value={formData.answers[question.id] || ''}
              onValueChange={(value) => {
                if (value) {
                  handleInputChange(question.id, value)
                }
              }}
              className="flex-col items-stretch gap-2 w-full"
              variant="outline"
            >
              {question.options.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="justify-start text-left p-4 h-auto min-h-[3.5rem] whitespace-normal break-words transition-all duration-200 data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:text-blue-900 data-[state=on]:shadow-md hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative"
                >
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 w-5 h-5 mr-3 rounded-full border-2 border-gray-300 transition-colors duration-200 flex items-center justify-center data-[state=on]:border-blue-500 data-[state=on]:bg-blue-500">
                      {formData.answers[question.id] === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-sm leading-relaxed font-medium">{option.label}</span>
                  </div>
                  {formData.answers[question.id] === option.value && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="px-8 py-2">
          {isSubmitting ? loadingText : submitButtonText}
        </Button>
      </div>
    </form>
  )
}
