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
      title: 'Tasa de Participación',
      value: `${completionRate}%`,
      description: 'Usuarios que completaron evaluaciones',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total de Evaluaciones',
      value: totalSubmissions.toLocaleString(),
      description: 'Evaluaciones de riesgo completadas',
      icon: ClipboardCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pacientes de Alto Riesgo',
      value: `${highRiskPercentage}%`,
      description: `${highRiskCount} pacientes necesitan atención`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Puntuación Promedio',
      value: averageScore.toFixed(1),
      description: 'En todas las evaluaciones',
      icon: Activity,
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
