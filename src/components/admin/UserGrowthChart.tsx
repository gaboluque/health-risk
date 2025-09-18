'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export function UserGrowthChart() {
  // Mock data for the chart - in a real app, this would come from your analytics
  const mockGrowthData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 145 },
    { month: 'Mar', users: 167 },
    { month: 'Apr', users: 189 },
    { month: 'May', users: 234 },
    { month: 'Jun', users: 278 },
  ]

  const totalGrowth = (
    ((mockGrowthData[mockGrowthData.length - 1].users - mockGrowthData[0].users) /
      mockGrowthData[0].users) *
    100
  ).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          User Growth
        </CardTitle>
        <CardDescription>User registration trends over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart representation */}
          <div className="space-y-2">
            {mockGrowthData.map((data, _index) => {
              const percentage =
                (data.users / Math.max(...mockGrowthData.map((d) => d.users))) * 100
              return (
                <div key={data.month} className="flex items-center gap-3">
                  <div className="w-8 text-sm text-muted-foreground">{data.month}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-right">{data.users}</div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Growth</span>
              <span className="font-medium text-green-600">+{totalGrowth}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
