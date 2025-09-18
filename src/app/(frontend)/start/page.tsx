import React from 'react'
import { STarTForm } from './components/STarTForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import startData from '@/lib/data/questionnaires/start.json'

export default function STarTPage() {
  const questionnaire = loadQuestionnaire(startData)

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

            {/* What is STarT Back */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">About STarT Back Tool</h3>
              <p className="text-green-800 text-sm leading-relaxed">
                The STarT Back Tool is a validated 9-question screening tool developed at Keele
                University to help identify patients with low back pain who are at risk of
                developing persistent disabling pain. It stratifies patients into three risk
                categories (low, medium, high) to guide appropriate treatment pathways. The tool has
                been shown to improve clinical outcomes and reduce healthcare costs when used to
                inform treatment decisions.
              </p>
            </div>

            {/* Risk Categories Overview */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Risk Categories</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>Low Risk:</strong> 16.7% chance of persistent disability -
                    Self-management recommended
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>Medium Risk:</strong> 53.2% chance of persistent disability -
                    Physiotherapy recommended
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>High Risk:</strong> 78.4% chance of persistent disability - Specialized
                    intervention needed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <STarTForm questionnaire={questionnaire} />
        </div>
      </div>
    </div>
  )
}
