'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertTriangle } from 'lucide-react'
import { RiskLevel } from '@/lib/types/questionnaire'
import { riskLevelToName, RISK_CHART_COLORS } from '@/lib/utils/risk-mapping'
import { useState } from 'react'

interface MonthlyData {
  month: string
  submissions: number
  highRisk: number
  riskDistribution: Record<RiskLevel, number>
}

interface RiskTrendsChartProps {
  monthlyData: MonthlyData[]
}

export function RiskTrendsChart({ monthlyData }: RiskTrendsChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<{
    month: string
    level: RiskLevel
    count: number
  } | null>(null)

  const _maxSubmissions = Math.max(...monthlyData.map((d) => d.submissions))

  const totalSubmissions = monthlyData.reduce((sum, d) => sum + d.submissions, 0)
  const totalHighRisk = monthlyData.reduce((sum, d) => sum + d.highRisk, 0)
  const highRiskPercentage =
    totalSubmissions > 0 ? ((totalHighRisk / totalSubmissions) * 100).toFixed(1) : '0'

  // Calculate trend
  const firstHalf = monthlyData.slice(0, 3).reduce((sum, d) => sum + d.submissions, 0) / 3
  const secondHalf = monthlyData.slice(3).reduce((sum, d) => sum + d.submissions, 0) / 3
  const trendPercentage =
    firstHalf > 0 ? (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1) : '0'
  const isPositiveTrend = parseFloat(trendPercentage) > 0

  // Calculate total risk distribution across all months
  const totalRiskDistribution = monthlyData.reduce(
    (acc, month) => {
      Object.entries(month.riskDistribution).forEach(([level, count]) => {
        acc[level as RiskLevel] = (acc[level as RiskLevel] || 0) + count
      })
      return acc
    },
    {} as Record<RiskLevel, number>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendencias de Riesgo
        </CardTitle>
        <CardDescription>
          Patrones mensuales de envíos e identificación de alto riesgo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Trend Overview */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <div className="text-sm text-muted-foreground">Total de Envíos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{totalHighRisk}</div>
              <div className="text-sm text-muted-foreground">Alto Riesgo</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{highRiskPercentage}%</div>
              <div className="text-sm text-muted-foreground">Tasa de Riesgo</div>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tendencias Mensuales</span>
              <div className="flex items-center gap-2">
                <Badge variant={isPositiveTrend ? 'default' : 'secondary'}>
                  {isPositiveTrend ? '+' : ''}
                  {trendPercentage}%
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {monthlyData.map((data, _index) => {
                // Calculate cumulative percentages for stacked bars (ordered from low to high risk)
                const riskOrder = [
                  RiskLevel.MINIMAL,
                  RiskLevel.LOW,
                  RiskLevel.MODERATE,
                  RiskLevel.HIGH,
                  RiskLevel.SEVERE,
                  RiskLevel.UNKNOWN,
                ]

                let cumulativePercentage = 0
                const riskSegments = riskOrder
                  .filter((level) => data.riskDistribution[level] > 0)
                  .map((level) => {
                    const count = data.riskDistribution[level]
                    // Calculate percentage relative to this month's total submissions, not global max
                    const segmentPercentage =
                      data.submissions > 0 ? (count / data.submissions) * 100 : 0
                    const segment = {
                      level,
                      count,
                      percentage: segmentPercentage,
                      startPercentage: cumulativePercentage,
                    }
                    cumulativePercentage += segmentPercentage
                    return segment
                  })

                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {(() => {
                          const moderateCount = data.riskDistribution[RiskLevel.MODERATE] || 0
                          const highCount =
                            (data.riskDistribution[RiskLevel.HIGH] || 0) +
                            (data.riskDistribution[RiskLevel.SEVERE] || 0)
                          const moderatePercentage =
                            data.submissions > 0
                              ? ((moderateCount / data.submissions) * 100).toFixed(0)
                              : '0'
                          const highPercentage =
                            data.submissions > 0
                              ? ((highCount / data.submissions) * 100).toFixed(0)
                              : '0'

                          return (
                            <div className="flex items-center gap-3">
                              {moderateCount > 0 && (
                                <div className="flex items-center gap-1 text-amber-600">
                                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                                  <span>{moderatePercentage}% moderado</span>
                                </div>
                              )}
                              {highCount > 0 && (
                                <div className="flex items-center gap-1 text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>{highPercentage}% alto riesgo</span>
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Stacked submissions bar */}
                    <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                      {data.submissions === 0 ? (
                        /* Empty state for months with no submissions */
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground/60">Sin datos</span>
                        </div>
                      ) : (
                        /* Normal stacked segments */
                        riskSegments.map((segment) => (
                          <div
                            key={segment.level}
                            className="absolute top-0 h-full transition-all duration-300 ease-out cursor-pointer hover:opacity-80"
                            style={{
                              left: `${segment.startPercentage}%`,
                              width: `${segment.percentage}%`,
                              backgroundColor: RISK_CHART_COLORS[segment.level],
                            }}
                            onMouseEnter={() =>
                              setHoveredSegment({
                                month: data.month,
                                level: segment.level,
                                count: segment.count,
                              })
                            }
                            onMouseLeave={() => setHoveredSegment(null)}
                          />
                        ))
                      )}
                    </div>

                    {/* Tooltip */}
                    {hoveredSegment && hoveredSegment.month === data.month && (
                      <div className="absolute z-10 bg-gray-900 text-white text-xs rounded-md px-2 py-1 mt-1 shadow-lg">
                        <div className="font-medium">{riskLevelToName(hoveredSegment.level)}</div>
                        <div>{hoveredSegment.count} envíos</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-4 border-t">
            {[
              RiskLevel.MINIMAL,
              RiskLevel.LOW,
              RiskLevel.MODERATE,
              RiskLevel.HIGH,
              RiskLevel.SEVERE,
              RiskLevel.UNKNOWN,
            ]
              .filter((level) => totalRiskDistribution[level] > 0)
              .map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: RISK_CHART_COLORS[level] }}
                  />
                  <span>{riskLevelToName(level)}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
