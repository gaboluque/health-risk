'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users } from 'lucide-react'

interface QuestionnairePerformanceProps {
  submissionsByQuestionnaire: Record<string, number>
}

export function QuestionnairePerformance({
  submissionsByQuestionnaire,
}: QuestionnairePerformanceProps) {
  const questionnaires = Object.entries(submissionsByQuestionnaire)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const totalSubmissions = questionnaires.reduce((sum, q) => sum + q.count, 0)
  const maxCount = Math.max(...questionnaires.map((q) => q.count))

  const getQuestionnaireColor = (name: string) => {
    const colors = {
      ASCVD: 'bg-red-500',
      FINDRISK: 'bg-blue-500',
      FRAX: 'bg-green-500',
      'GAD-7': 'bg-purple-500',
      STarT: 'bg-orange-500',
    }

    for (const [key, color] of Object.entries(colors)) {
      if (name.toUpperCase().includes(key)) return color
    }
    return 'bg-gray-500'
  }

  const getQuestionnaireDescription = (name: string) => {
    const descriptions = {
      ASCVD: 'Cardiovascular Disease Risk',
      FINDRISK: 'Diabetes Risk Assessment',
      FRAX: 'Fracture Risk Assessment',
      'GAD-7': 'Anxiety Disorder Screening',
      STarT: 'Back Pain Assessment',
    }

    for (const [key, desc] of Object.entries(descriptions)) {
      if (name.toUpperCase().includes(key)) return desc
    }
    return 'Health Risk Assessment'
  }

  if (questionnaires.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Questionnaire Performance
          </CardTitle>
          <CardDescription>Usage statistics for each assessment type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No questionnaire data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Questionnaire Performance
        </CardTitle>
        <CardDescription>Usage statistics and popularity of each assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{questionnaires.length}</div>
              <div className="text-sm text-muted-foreground">Active Questionnaires</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <div className="text-sm text-muted-foreground">Total Responses</div>
            </div>
          </div>

          {/* Performance List */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Usage by Assessment</h4>
            <div className="space-y-3">
              {questionnaires.map((questionnaire, index) => {
                const percentage =
                  totalSubmissions > 0 ? (questionnaire.count / totalSubmissions) * 100 : 0
                const barPercentage = maxCount > 0 ? (questionnaire.count / maxCount) * 100 : 0
                const color = getQuestionnaireColor(questionnaire.name)
                const description = getQuestionnaireDescription(questionnaire.name)

                return (
                  <div key={questionnaire.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="font-medium text-sm">{questionnaire.name}</span>
                        </div>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{questionnaire.count}</span>
                        <span className="text-muted-foreground">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-1">{description}</div>

                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all duration-1000 ease-out`}
                        style={{ width: `${barPercentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Insights */}
          <div className="pt-4 border-t">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-blue-900">Assessment Insights</div>
                <div className="text-xs text-blue-700">
                  {questionnaires[0]?.name} is the most used assessment with{' '}
                  {questionnaires[0]?.count} submissions. Consider promoting less-used assessments
                  to provide comprehensive health screening.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
