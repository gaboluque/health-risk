'use client'

import { Users, ClipboardList, FileText, TrendingUp, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardStatsProps {
  stats: {
    totalUsers: number
    totalSubmissions: number
    totalQuestionnaires: number
    completionRate: number
    adminUsers: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      description: 'Active patients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions.toLocaleString(),
      description: 'Risk assessments completed',
      icon: ClipboardList,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Questionnaires',
      value: stats.totalQuestionnaires.toLocaleString(),
      description: 'Available assessments',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'New',
      changeType: 'neutral' as const,
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      description: 'Last 30 days',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers.toLocaleString(),
      description: 'System administrators',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: 'Secure',
      changeType: 'neutral' as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Badge 
                variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {stat.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
