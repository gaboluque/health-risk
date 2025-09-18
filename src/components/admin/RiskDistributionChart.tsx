'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart } from 'lucide-react'

export function RiskDistributionChart() {
  // Mock data for risk distribution - in a real app, this would come from your database
  const riskData = [
    { level: 'Low Risk', count: 156, percentage: 45, color: 'bg-green-500' },
    { level: 'Moderate Risk', count: 89, percentage: 26, color: 'bg-yellow-500' },
    { level: 'High Risk', count: 67, percentage: 19, color: 'bg-orange-500' },
    { level: 'Very High Risk', count: 34, percentage: 10, color: 'bg-red-500' },
  ]

  const totalAssessments = riskData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Risk Distribution
        </CardTitle>
        <CardDescription>Distribution of risk levels across all assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie chart representation using stacked bars */}
          <div className="space-y-3">
            {riskData.map((risk, _index) => (
              <div key={risk.level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                    <span className="font-medium">{risk.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{risk.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {risk.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${risk.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${risk.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Assessments</span>
              <span className="font-medium">{totalAssessments.toLocaleString()}</span>
            </div>
          </div>

          {/* Risk level indicators */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {riskData[0].percentage.toFixed(0)}%
              </div>
              <div className="text-xs text-green-600">Low Risk</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-700">
                {(riskData[2].percentage + riskData[3].percentage).toFixed(0)}%
              </div>
              <div className="text-xs text-red-600">High Risk+</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
