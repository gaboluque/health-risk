import React from 'react'
import { FINDRISKForm } from './components/FINDRISKForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import findriskData from '@/lib/data/questionnaires/findrisk.json'

export default function FINDRISKPage() {
  const questionnaire = loadQuestionnaire(findriskData)

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

            {/* What is FINDRISK */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">About FINDRISK</h3>
              <p className="text-green-800 text-sm leading-relaxed">
                The Finnish Diabetes Risk Score (FINDRISK) is a simple, fast, inexpensive,
                non-invasive, and reliable tool for identifying people at high risk for Type 2
                diabetes. It was developed in Finland and has been validated in multiple populations
                worldwide. The questionnaire takes into account age, BMI, waist circumference,
                physical activity, diet, medication use, glucose history, and family history of
                diabetes.
              </p>
            </div>
          </div>

          <FINDRISKForm questionnaire={questionnaire} />
        </div>
      </div>
    </div>
  )
}
