'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertTriangle, Info, ArrowRight, RotateCcw, Heart, Brain } from 'lucide-react'
import type { QuestionnaireSchema, SubmissionResult, RiskCategory } from '@/lib/types/questionnaire'

interface QuestionnaireResultsProps {
  questionnaire: QuestionnaireSchema
  results: SubmissionResult
  onStartOver?: () => void
  customActions?: React.ReactNode
}

const getRiskIcon = (riskLevel: string) => {
  const level = riskLevel.toLowerCase()
  if (level.includes('low') || level.includes('minimal')) {
    return CheckCircle
  } else if (level.includes('high') || level.includes('severe')) {
    return AlertTriangle
  } else {
    return Info
  }
}

export function QuestionnaireResults({
  questionnaire,
  results,
  onStartOver,
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
  const RiskIcon = getRiskIcon(categoryDetails.name)

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="mb-6">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl text-white text-lg font-bold mb-4 shadow-lg"
            style={{ backgroundColor: categoryDetails.color }}
          >
            <RiskIcon className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">{categoryDetails.name}</h3>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
              {categoryDetails.description}
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start">
          <div className="p-2 bg-blue-100 rounded-lg mr-4 mt-1">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">What This Means</h4>
            <div className="prose prose-blue text-sm text-blue-800 leading-relaxed">
              <p>{categoryDetails.description}</p>
              {categoryDetails.name.toLowerCase().includes('high') && (
                <p className="mt-2">
                  <strong>Recommendation:</strong> Consider discussing these results with your
                  healthcare provider to develop an appropriate prevention or management plan.
                </p>
              )}
              {categoryDetails.name.toLowerCase().includes('low') && (
                <p className="mt-2">
                  <strong>Recommendation:</strong> Continue with regular health maintenance and
                  periodic reassessment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start">
          <div className="p-2 bg-amber-100 rounded-lg mr-4 mt-1">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-amber-900 mb-3">
              Important Medical Disclaimer
            </h4>
            <div className="text-sm text-amber-800 leading-relaxed space-y-2">
              <p>
                This risk calculator is for <strong>informational purposes only</strong> and should
                not replace professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                The results are estimates based on population data and may not reflect your
                individual risk. Many factors can influence your personal health outcomes.
              </p>
              <p>
                <strong>Please consult with your healthcare provider</strong> to discuss these
                results and determine the most appropriate care plan for your specific situation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {onStartOver && (
            <Button
              onClick={onStartOver}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 border-slate-300 hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Assessment
            </Button>
          )}

          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
            >
              Take Another Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {customActions && <div className="mt-4 flex justify-center">{customActions}</div>}
      </div>

      {/* Related Assessments */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-slate-900 mb-4 text-center">
          Consider These Related Assessments
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questionnaire.id !== 'ascvd' && (
            <Link href="/ascvd" className="group">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Heart Health</div>
                    <div className="text-xs text-slate-600">ASCVD Risk Assessment</div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {questionnaire.id !== 'gad7' && (
            <Link href="/gad7" className="group">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Anxiety Screen</div>
                    <div className="text-xs text-slate-600">GAD-7 Assessment</div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
