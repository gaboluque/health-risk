'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import ascvdData from '@/lib/data/questionnaires/ascvd.json'

interface ASCVDResultsProps {
  results: {
    submission: {
      id: string
      submittedBy: {
        firstName: string
        lastName: string
        email: string
      }
    }
    riskResult: {
      score: number
      risk: string
      interpretation: string
    }
  }
  onStartOver: () => void
}

export function ASCVDResults({ results, onStartOver }: ASCVDResultsProps) {
  const { riskResult } = results

  // Get risk category details from the questionnaire data
  const getRiskCategoryDetails = (riskScore: number) => {
    const category = ascvdData.scoring.riskCategories.find(
      (cat) => riskScore >= cat.range.min && riskScore <= cat.range.max,
    )
    return category || ascvdData.scoring.riskCategories[ascvdData.scoring.riskCategories.length - 1]
  }

  const categoryDetails = getRiskCategoryDetails(riskResult.score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your ASCVD Risk Assessment Results
        </h2>
        <p className="text-gray-600">Based on the 2013 ACC/AHA Pooled Cohort Equations</p>
      </div>

      {/* Risk Score Display */}
      <div className="bg-white border-2 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full text-white text-3xl font-bold mb-4"
            style={{ backgroundColor: categoryDetails.color }}
          >
            {riskResult.score.toFixed(1)}%
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            10-Year ASCVD Risk: {categoryDetails.name}
          </h3>
          <p className="text-gray-600">{categoryDetails.description}</p>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">Clinical Interpretation</h4>
        <p className="text-blue-800 leading-relaxed">{riskResult.interpretation}</p>
      </div>

      {/* Risk Categories Reference */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Category Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ascvdData.scoring.riskCategories.map((category, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                category.name === categoryDetails.name
                  ? 'border-gray-900 bg-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center mb-2">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-semibold">{category.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {category.range.min}% - {category.range.max}%
              </p>
              <p className="text-sm text-gray-700">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-yellow-900 mb-3">Important Medical Disclaimer</h4>
        <p className="text-yellow-800 text-sm leading-relaxed">
          This risk calculator is for informational purposes only and should not replace
          professional medical advice. The results are estimates based on population data and may
          not reflect your individual risk. Please consult with your healthcare provider to discuss
          these results and determine the most appropriate treatment plan for your specific
          situation.
        </p>
      </div>

      {/* References */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Clinical References</h4>
        <div className="space-y-2">
          {ascvdData.references.map((reference, index) => (
            <div key={index}>
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                {reference.title}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <Button onClick={onStartOver} variant="outline" className="px-6">
          Take Assessment Again
        </Button>
        <Button onClick={() => window.print()} className="px-6">
          Print Results
        </Button>
      </div>
    </div>
  )
}
