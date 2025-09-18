'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import type { QuestionnaireSchema, SubmissionResult, RiskCategory } from '@/lib/types/questionnaire'

interface QuestionnaireResultsProps {
  questionnaire: QuestionnaireSchema
  results: SubmissionResult
  onStartOver: () => void
  showPrintButton?: boolean
  customActions?: React.ReactNode
}

export function QuestionnaireResults({
  questionnaire,
  results,
  onStartOver,
  showPrintButton = true,
  customActions,
}: QuestionnaireResultsProps) {
  const { riskResult } = results

  const getRiskCategoryDetails = (riskScore: number): RiskCategory => {
    const category = questionnaire.scoring.riskCategories.find(
      (cat) => riskScore >= cat.range.min && riskScore <= cat.range.max,
    )
    return (
      category ||
      questionnaire.scoring.riskCategories[questionnaire.scoring.riskCategories.length - 1]
    )
  }

  const categoryDetails = getRiskCategoryDetails(riskResult.score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your {questionnaire.patientFriendlyName || questionnaire.name} Results
        </h2>
        <p className="text-gray-600">
          {questionnaire.patientFriendlyDescription || questionnaire.description}
        </p>
      </div>

      {/* Risk Category Display */}
      <div className="bg-white border-2 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full text-white text-2xl font-bold mb-4"
            style={{ backgroundColor: categoryDetails.color }}
          >
            {categoryDetails.name}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your Risk Level: {categoryDetails.name}
          </h3>
          <p className="text-gray-600">{categoryDetails.description}</p>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">Clinical Interpretation</h4>
        <p className="text-blue-800 leading-relaxed">{riskResult.interpretation}</p>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-yellow-700 mb-3">Important Medical Disclaimer</h4>
        <p className="text-yellow-800 text-xs leading-relaxed">
          This risk calculator is for informational purposes only and should not replace
          professional medical advice. The results are estimates based on population data and may
          not reflect your individual risk.
          <br />
          Please consult with your healthcare provider to discuss these results and determine the
          most appropriate treatment plan for your specific situation.
        </p>
      </div>
    </div>
  )
}
