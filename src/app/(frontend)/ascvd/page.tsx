import React from 'react'
import { ASCVDForm } from './components/ASCVDForm'
import ascvdData from '@/lib/data/questionnaires/ascvd.json'

export default function ASCVDPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ascvdData.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{ascvdData.description}</p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Target Population:</strong> {ascvdData.metadata.targetPopulation}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Estimated Time:</strong> {ascvdData.metadata.estimatedCompletionTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ASCVDForm questionnaire={ascvdData} />
        </div>
      </div>
    </div>
  )
}
