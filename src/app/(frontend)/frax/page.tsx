import React from 'react'
import { FRAXForm } from './components/FRAXForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import fraxData from '@/lib/data/questionnaires/frax.json'

export default function FRAXPage() {
  const questionnaire = loadQuestionnaire(fraxData)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{questionnaire.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{questionnaire.description}</p>

            {/* Information Panel */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Target Population:</strong> {questionnaire.metadata.targetPopulation}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Estimated Time:</strong>{' '}
                    {questionnaire.metadata.estimatedCompletionTime}
                  </p>
                </div>
              </div>
            </div>

            {/* What is FRAX */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">About FRAX</h3>
              <p className="text-green-800 text-sm leading-relaxed">
                FRAX (Fracture Risk Assessment Tool) is a web-based algorithm developed by the WHO
                to evaluate fracture risk of patients. It calculates the 10-year probability of a
                major osteoporotic fracture (hip, spine, humerus or wrist) and the 10-year
                probability of a hip fracture. FRAX integrates clinical risk factors with or without
                bone mineral density (BMD) values to provide country-specific fracture
                probabilities.
              </p>
            </div>
          </div>

          <FRAXForm questionnaire={questionnaire} />
        </div>
      </div>
    </div>
  )
}
