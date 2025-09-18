'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Users,
  ClipboardCheck,
  AlertTriangle,
  Activity,
} from 'lucide-react'

interface AnalyticsOverviewProps {
  data: {
    totalUsers: number
    totalSubmissions: number
    riskDistribution: Record<string, number>
    averageScore: number
  }
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const { totalUsers, totalSubmissions, riskDistribution, averageScore } = data

  const highRiskCount = (riskDistribution.high || 0) + (riskDistribution['very-high'] || 0)
  const completionRate = totalUsers > 0 ? ((totalSubmissions / totalUsers) * 100).toFixed(1) : '0'
  const highRiskPercentage =
    totalSubmissions > 0 ? ((highRiskCount / totalSubmissions) * 100).toFixed(1) : '0'

  const metrics = [
    {
      title: 'Engagement Rate',
      value: `${completionRate}%`,
      description: 'Users who completed assessments',
      icon: Users,
      trend: '+12%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Assessments',
      value: totalSubmissions.toLocaleString(),
      description: 'Completed risk assessments',
      icon: ClipboardCheck,
      trend: '+8%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'High Risk Patients',
      value: `${highRiskPercentage}%`,
      description: `${highRiskCount} patients need attention`,
      icon: AlertTriangle,
      trend: '-3%',
      trendUp: false,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Average Score',
      value: averageScore.toFixed(1),
      description: 'Across all assessments',
      icon: Activity,
      trend: '+0.5',
      trendUp: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              <div className="flex items-center gap-1">
                {metric.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <Badge variant={metric.trendUp ? 'default' : 'secondary'} className="text-xs">
                  {metric.trend}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
