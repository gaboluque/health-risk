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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Risk Results and Recommendations */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm sm:shadow-lg">
        {/* Risk Indicator */}
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold mb-4 shadow-md sm:shadow-lg"
            style={{ backgroundColor: categoryDetails.color }}
          >
            <RiskIcon className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>

          <div className="space-y-2 px-4 sm:px-0">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{categoryDetails.name}</h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              {categoryDetails.description}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {categoryDetails.recommendations && categoryDetails.recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-blue-900">
                  Recommendations
                </h4>
              </div>
              <div className="space-y-3">
                {categoryDetails.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-blue-100"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5" />
                    <p className="text-sm sm:text-base text-blue-800 leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-amber-900">
              Important Medical Disclaimer
            </h4>
          </div>
          <div className="text-sm sm:text-base text-amber-800 leading-relaxed space-y-3 pl-0">
            <p>
              This risk calculator is for <strong>informational purposes only</strong> and should
              not replace professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              The results are estimates based on population data and may not reflect your individual
              risk. Many factors can influence your personal health outcomes.
            </p>
            <p>
              <strong>Please consult with your healthcare provider</strong> to discuss these results
              and determine the most appropriate care plan for your specific situation.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-center sm:flex-row">
          {onStartOver && (
            <Button
              onClick={onStartOver}
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-100 h-12 sm:h-auto w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Assessment
            </Button>
          )}

          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 h-12 sm:h-auto w-full"
            >
              Take Another Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {customActions && <div className="mt-4 flex justify-center">{customActions}</div>}
      </div>

      {/* Related Assessments */}
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 text-center px-4 sm:px-0">
          Consider These Related Assessments
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {questionnaire.id !== 'ascvd' && (
            <Link href="/ascvd" className="group">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors min-h-[60px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg group-hover:bg-red-200">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm sm:text-base">
                      Heart Health
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">ASCVD Risk Assessment</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </div>
              </div>
            </Link>
          )}

          {questionnaire.id !== 'gad7' && (
            <Link href="/gad7" className="group">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors min-h-[60px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm sm:text-base">
                      Anxiety Screen
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">GAD-7 Assessment</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
