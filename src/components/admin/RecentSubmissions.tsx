'use client'

import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getQuestionnaireImpactArea } from '@/lib/utils/questionnaires/questionnaire-registry'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import { RiskLevel } from '@/lib/types/questionnaire'
import { RISK_LEVEL_COLORS, riskLevelToNumber, riskNumberToName } from '@/lib/utils/risk-mapping'

interface Submission {
  id: string
  questionnaire:
    | {
        name: string
      }
    | string
  totalScore: number
  riskLevel: RiskLevel
  createdAt: string
}

interface RecentSubmissionsProps {
  submissions: Submission[]
}

const getRiskBadgeVariant = (riskLevel: RiskLevel) => {
  const level = riskLevel.toLowerCase()
  if (level.includes(RiskLevel.LOW)) return 'secondary'
  if (level.includes(RiskLevel.MODERATE)) return 'default'
  if (level.includes(RiskLevel.HIGH)) return 'destructive'
  return 'outline'
}

const getRiskColor = (riskLevel: RiskLevel) => {
  const colorConfig = RISK_LEVEL_COLORS[riskLevel] || RISK_LEVEL_COLORS[RiskLevel.UNKNOWN]
  return `text-${colorConfig.textColor}`
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Envíos Recientes</CardTitle>
          <CardDescription>Últimos envíos de evaluaciones de riesgo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron envíos recientes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Envíos Recientes</CardTitle>
          <CardDescription>Últimos envíos de evaluaciones de riesgo</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => {
            const questionnaireName =
              typeof submission.questionnaire === 'string'
                ? 'Cuestionario Desconocido'
                : submission.questionnaire.name
            const impactArea = getQuestionnaireImpactArea(questionnaireName)

            return (
              <div key={submission.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {impactArea.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{impactArea}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Puntuación: {submission.totalScore}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={getRiskBadgeVariant(submission.riskLevel)}
                    className={getRiskColor(submission.riskLevel)}
                  >
                    {riskNumberToName(riskLevelToNumber(submission.riskLevel))}
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
