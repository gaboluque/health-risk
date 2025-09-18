import React from 'react'
import { GAD7Form } from './components/GAD7Form'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import gad7Data from '@/lib/data/questionnaires/gad7.json'

export default function GAD7Page() {
  const questionnaire = loadQuestionnaire(gad7Data)

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

            {/* What is GAD-7 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">About GAD-7</h3>
              <p className="text-green-800 text-sm leading-relaxed">
                The GAD-7 (Generalized Anxiety Disorder 7-item scale) is a validated, efficient tool
                for screening for GAD and assessing its severity in clinical practice and research.
                Developed by Dr. Robert Spitzer and colleagues, it consists of 7 items that measure
                the frequency of anxiety symptoms over the past 2 weeks. A score of 10 or greater
                indicates probable GAD with 89% sensitivity and 82% specificity.
              </p>
            </div>

            {/* Severity Categories Overview */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Severity Categories</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>Minimal (0-4):</strong> No clinically significant anxiety
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-lime-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>Mild (5-9):</strong> May indicate mild GAD or adjustment disorder
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>Moderate (10-14):</strong> Likely GAD - professional evaluation
                    recommended
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-yellow-800">
                    <strong>Severe (15-21):</strong> Strong indication of GAD - immediate attention
                    required
                  </span>
                </div>
              </div>
            </div>

            {/* Screening Information */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Screening Information</h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                <strong>Screening Cutoff:</strong> A score ≥10 indicates probable GAD and warrants
                further clinical evaluation.
                <br />
                <strong>Accuracy:</strong> 89% sensitivity, 82% specificity for detecting GAD.
                <br />
                <strong>Important:</strong> This is a screening tool and should be used in
                conjunction with clinical judgment. It does not replace professional mental health
                assessment.
              </p>
            </div>
          </div>

          <GAD7Form questionnaire={questionnaire} />
        </div>
      </div>
    </div>
  )
}
