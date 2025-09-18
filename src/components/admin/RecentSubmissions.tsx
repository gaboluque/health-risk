'use client'

import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

interface Submission {
  id: string
  questionnaire:
    | {
        name: string
      }
    | string
  totalScore: number
  standardRiskLevel: 'low' | 'moderate' | 'high' | 'very-high'
  riskLevel: string
  createdAt: string
}

interface RecentSubmissionsProps {
  submissions: Submission[]
}

const getRiskBadgeVariant = (riskLevel: string) => {
  const level = riskLevel.toLowerCase()
  if (level.includes('low')) return 'secondary'
  if (level.includes('moderate')) return 'default'
  if (level.includes('high')) return 'destructive'
  return 'outline'
}

const getRiskColor = (standardRiskLevel: string) => {
  switch (standardRiskLevel) {
    case 'low':
      return 'text-green-600'
    case 'moderate':
      return 'text-yellow-600'
    case 'high':
      return 'text-orange-600'
    case 'very-high':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest risk assessment submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent submissions found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest risk assessment submissions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/private/admin/submissions">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => {
            const questionnaireName =
              typeof submission.questionnaire === 'string'
                ? 'Unknown Questionnaire'
                : submission.questionnaire.name

            return (
              <div key={submission.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {questionnaireName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{questionnaireName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Score: {submission.totalScore}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={getRiskBadgeVariant(submission.riskLevel)}
                    className={getRiskColor(submission.standardRiskLevel)}
                  >
                    {submission.standardRiskLevel.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
