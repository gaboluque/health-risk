'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'
import { riskNumberToName } from '@/lib/utils/risk-mapping'
import { StandardRiskLevel } from '@/lib/types/questionnaire'
import { getQuestionnaireChartColor } from '@/lib/utils/questionnaire-registry'

export interface MonthlyRiskData {
  month: string
  averageRisk: number
  submissionCount: number
  riskDistribution: Record<StandardRiskLevel, number>
}

export interface QuestionnaireRiskData {
  questionnaireName: string
  questionnaireId: string
  monthlyData: MonthlyRiskData[]
  overallTrend: 'increasing' | 'decreasing' | 'stable'
  trendPercentage: number
  averageRisk: number
  totalSubmissions: number
}

interface QuestionnaireRiskTrendsProps {
  questionnaireRiskData: QuestionnaireRiskData[]
}

export function QuestionnaireRiskTrends({ questionnaireRiskData }: QuestionnaireRiskTrendsProps) {
  if (questionnaireRiskData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tendencias de Riesgo por Cuestionario
          </CardTitle>
          <CardDescription>
            Análisis de tendencias de riesgo promedio para cada tipo de evaluación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay datos de tendencias disponibles</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get all unique months from all questionnaires
  const allMonths =
    questionnaireRiskData.length > 0 ? questionnaireRiskData[0].monthlyData.map((m) => m.month) : []

  // Calculate chart dimensions
  const chartHeight = 300
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 60 }
  const chartWidth = 800
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom

  // Y-axis scale (0 to 5 for risk levels)
  const maxRisk = 5
  const minRisk = 0

  // Helper function for line chart colors
  const getQuestionnaireLineColor = (name: string) => {
    return getQuestionnaireChartColor(name)
  }

  // Generate SVG path for a questionnaire line
  const generateLinePath = (questionnaire: QuestionnaireRiskData) => {
    const points = questionnaire.monthlyData
      .map((monthData, index) => {
        if (monthData.submissionCount === 0) return null

        const x = (index / (allMonths.length - 1)) * plotWidth
        const y =
          plotHeight - ((monthData.averageRisk - minRisk) / (maxRisk - minRisk)) * plotHeight
        return `${x},${y}`
      })
      .filter(Boolean)

    if (points.length === 0) return ''

    return `M ${points.join(' L ')}`
  }

  // Generate circle points for data markers
  const generateDataPoints = (questionnaire: QuestionnaireRiskData) => {
    return questionnaire.monthlyData
      .map((monthData, index) => {
        if (monthData.submissionCount === 0) return null

        const x = (index / (allMonths.length - 1)) * plotWidth
        const y =
          plotHeight - ((monthData.averageRisk - minRisk) / (maxRisk - minRisk)) * plotHeight

        return {
          x,
          y,
          value: monthData.averageRisk,
          month: monthData.month,
          submissions: monthData.submissionCount,
        }
      })
      .filter((point): point is NonNullable<typeof point> => point !== null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Tendencias de Riesgo por Cuestionario
        </CardTitle>
        <CardDescription>
          Análisis comparativo de tendencias de riesgo promedio (últimos 6 meses)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {questionnaireRiskData.map((questionnaire) => (
              <div key={questionnaire.questionnaireId} className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getQuestionnaireLineColor(questionnaire.questionnaireName),
                    }}
                  />
                  <span className="text-sm font-medium">{questionnaire.questionnaireName}</span>
                </div>
                <div className="text-lg font-bold">{questionnaire.averageRisk.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {riskNumberToName(Math.round(questionnaire.averageRisk))}
                </div>
                <div className="flex items-center justify-center gap-1">
                  {questionnaire.overallTrend === 'increasing' && (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  )}
                  {questionnaire.overallTrend === 'decreasing' && (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                  {questionnaire.overallTrend === 'stable' && (
                    <Minus className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {questionnaire.trendPercentage !== 0 && (
                      <>
                        {questionnaire.trendPercentage > 0 ? '+' : ''}
                        {questionnaire.trendPercentage.toFixed(1)}%
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Line Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <svg
                width={chartWidth}
                height={chartHeight}
                className="border rounded-lg bg-background"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              >
                {/* Grid lines */}
                <g className="opacity-20">
                  {/* Horizontal grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((risk) => {
                    const y =
                      chartPadding.top +
                      plotHeight -
                      ((risk - minRisk) / (maxRisk - minRisk)) * plotHeight
                    return (
                      <line
                        key={`h-grid-${risk}`}
                        x1={chartPadding.left}
                        y1={y}
                        x2={chartPadding.left + plotWidth}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    )
                  })}
                  {/* Vertical grid lines */}
                  {allMonths.map((_, index) => {
                    const x = chartPadding.left + (index / (allMonths.length - 1)) * plotWidth
                    return (
                      <line
                        key={`v-grid-${index}`}
                        x1={x}
                        y1={chartPadding.top}
                        x2={x}
                        y2={chartPadding.top + plotHeight}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    )
                  })}
                </g>

                {/* Y-axis labels */}
                <g className="text-xs fill-muted-foreground">
                  {[0, 1, 2, 3, 4, 5].map((risk) => {
                    const y =
                      chartPadding.top +
                      plotHeight -
                      ((risk - minRisk) / (maxRisk - minRisk)) * plotHeight
                    return (
                      <text
                        key={`y-label-${risk}`}
                        x={chartPadding.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-muted-foreground"
                      >
                        {risk} - {riskNumberToName(risk)}
                      </text>
                    )
                  })}
                </g>

                {/* X-axis labels */}
                <g className="text-xs fill-muted-foreground">
                  {allMonths.map((month, index) => {
                    const x = chartPadding.left + (index / (allMonths.length - 1)) * plotWidth
                    return (
                      <text
                        key={`x-label-${index}`}
                        x={x}
                        y={chartPadding.top + plotHeight + 20}
                        textAnchor="middle"
                        className="fill-muted-foreground"
                      >
                        {month}
                      </text>
                    )
                  })}
                </g>

                {/* Data lines */}
                <g transform={`translate(${chartPadding.left}, ${chartPadding.top})`}>
                  {questionnaireRiskData.map((questionnaire) => {
                    const linePath = generateLinePath(questionnaire)
                    const dataPoints = generateDataPoints(questionnaire)
                    const color = getQuestionnaireLineColor(questionnaire.questionnaireName)

                    return (
                      <g key={questionnaire.questionnaireId}>
                        {/* Line */}
                        {linePath && (
                          <path
                            d={linePath}
                            fill="none"
                            stroke={color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-sm"
                          />
                        )}

                        {/* Data points */}
                        {dataPoints.map((point, index) => (
                          <g key={`${questionnaire.questionnaireId}-point-${index}`}>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="6"
                              fill="white"
                              stroke={color}
                              strokeWidth="3"
                              className="drop-shadow-sm"
                            />
                            <circle cx={point.x} cy={point.y} r="3" fill={color} />

                            {/* Tooltip on hover */}
                            <title>
                              {questionnaire.questionnaireName} - {point.month}
                              {'\n'}Riesgo Promedio: {point.value.toFixed(2)} (
                              {riskNumberToName(Math.round(point.value))}){'\n'}Evaluaciones:{' '}
                              {point.submissions}
                            </title>
                          </g>
                        ))}
                      </g>
                    )
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t">
            {questionnaireRiskData.map((questionnaire) => (
              <div key={questionnaire.questionnaireId} className="flex items-center gap-2">
                <div
                  className="w-4 h-0.5 rounded"
                  style={{
                    backgroundColor: getQuestionnaireLineColor(questionnaire.questionnaireName),
                  }}
                />
                <span className="text-sm">{questionnaire.questionnaireName}</span>
                <span className="text-xs text-muted-foreground">
                  ({questionnaire.totalSubmissions} evaluaciones)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
