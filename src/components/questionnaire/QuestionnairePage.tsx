import React from 'react'
import { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface QuestionnairePageProps {
  questionnaire: QuestionnaireSchema
  children: React.ReactNode
}

export function QuestionnairePage({ questionnaire, children }: QuestionnairePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {questionnaire.patientFriendlyName || questionnaire.name}
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {questionnaire.patientFriendlyDescription || questionnaire.description}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
