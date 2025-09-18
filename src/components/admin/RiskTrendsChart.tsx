'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertTriangle } from 'lucide-react'

interface MonthlyData {
  month: string
  submissions: number
  highRisk: number
}

interface RiskTrendsChartProps {
  monthlyData: MonthlyData[]
}

export function RiskTrendsChart({ monthlyData }: RiskTrendsChartProps) {
  const maxSubmissions = Math.max(...monthlyData.map((d) => d.submissions))

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Risk Trends
        </CardTitle>
        <CardDescription>Monthly submission patterns and high-risk identification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Trend Overview */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{totalHighRisk}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{highRiskPercentage}%</div>
              <div className="text-sm text-muted-foreground">Risk Rate</div>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Trends</span>
              <div className="flex items-center gap-2">
                <Badge variant={isPositiveTrend ? 'default' : 'secondary'}>
                  {isPositiveTrend ? '+' : ''}
                  {trendPercentage}%
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {monthlyData.map((data, _index) => {
                const submissionPercentage =
                  maxSubmissions > 0 ? (data.submissions / maxSubmissions) * 100 : 0

                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{data.submissions} total</span>
                        {data.highRisk > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{data.highRisk} high risk</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submissions bar */}
                    <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                        style={{ width: `${submissionPercentage}%` }}
                      />
                      {/* High risk overlay */}
                      {data.highRisk > 0 && (
                        <div
                          className="absolute top-0 right-0 h-full bg-red-500 opacity-75"
                          style={{ width: `${(data.highRisk / maxSubmissions) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Total Submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>High Risk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
