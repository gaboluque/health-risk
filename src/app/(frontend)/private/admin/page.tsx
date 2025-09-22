import { getPayload } from 'payload'
import config from '@/payload.config'
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview'
import { RiskTrendsChart } from '@/components/admin/RiskTrendsChart'
import { QuestionnairePerformance } from '@/components/admin/QuestionnairePerformance'
import {
  QuestionnaireRiskTrends,
  type QuestionnaireRiskData,
} from '@/components/admin/QuestionnaireRiskTrends'
import { calculateAverageRisk, riskNumberToName } from '@/lib/utils/risk-mapping'
import { RiskLevel } from '@/lib/types/questionnaire'

export default async function AnalyticsPage() {
  const payload = await getPayload({ config })

  // Fetch analytics data
  const [submissionsResult, usersResult] = await Promise.all([
    payload.find({
      collection: 'questionnaire-submissions',
      limit: 1000, // Get more for analytics
      sort: '-createdAt',
    }),
    payload.find({ collection: 'users', limit: 0, where: { role: { equals: 'user' } } }),
    payload.find({ collection: 'questionnaires', limit: 0 }),
  ])

  // Calculate analytics data
  const submissions = submissionsResult.docs
  const totalUsers = usersResult.totalDocs
  const totalSubmissions = submissionsResult.totalDocs

  // Risk distribution
  const riskDistribution = submissions.reduce(
    (acc, submission) => {
      acc[submission.riskLevel] = (acc[submission.riskLevel] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Submissions by questionnaire
  const submissionsByQuestionnaire = submissions.reduce(
    (acc, submission) => {
      const questionnaireName =
        typeof submission.questionnaire === 'string' ? 'Unknown' : submission.questionnaire.name
      acc[questionnaireName] = (acc[questionnaireName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Monthly trends (last 6 months)
  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const monthSubmissions = submissions.filter((s) => {
      const submissionDate = new Date(s.createdAt)
      return submissionDate >= monthStart && submissionDate <= monthEnd
    })

    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      submissions: monthSubmissions.length,
      highRisk: monthSubmissions.filter(
        (s) => s.riskLevel === RiskLevel.HIGH || s.riskLevel === RiskLevel.SEVERE,
      ).length,
    })
  }

  // Calculate risk trends by questionnaire
  const questionnaireRiskData: QuestionnaireRiskData[] = []
  const uniqueQuestionnaires = [
    ...new Set(
      submissions.map((s) =>
        typeof s.questionnaire === 'string' ? s.questionnaire : s.questionnaire.name,
      ),
    ),
  ]

  for (const questionnaireName of uniqueQuestionnaires) {
    if (questionnaireName === 'Unknown') continue

    const questionnaireSubmissions = submissions.filter((s) => {
      const name = typeof s.questionnaire === 'string' ? s.questionnaire : s.questionnaire.name
      return name === questionnaireName
    })

    if (questionnaireSubmissions.length === 0) continue

    // Calculate monthly data for this questionnaire
    const questionnaireMonthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthSubmissions = questionnaireSubmissions.filter((s) => {
        const submissionDate = new Date(s.createdAt)
        return submissionDate >= monthStart && submissionDate <= monthEnd
      })

      if (monthSubmissions.length > 0) {
        const riskValues = monthSubmissions.map((s) => s.riskValue)
        const averageRisk = calculateAverageRisk(riskValues)

        // Calculate risk distribution for this month
        const riskDistribution = riskValues.reduce(
          (acc, value) => {
            const level = riskNumberToName(value)
            acc[level] = (acc[level] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        questionnaireMonthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          averageRisk,
          submissionCount: monthSubmissions.length,
          riskDistribution,
        })
      } else {
        questionnaireMonthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          averageRisk: 0,
          submissionCount: 0,
          riskDistribution: {} as Record<RiskLevel, number>,
        })
      }
    }

    // Calculate overall trend
    const nonZeroMonths = questionnaireMonthlyData.filter((m) => m.submissionCount > 0)
    let overallTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'
    let trendPercentage = 0

    if (nonZeroMonths.length >= 2) {
      const firstHalf = nonZeroMonths.slice(0, Math.ceil(nonZeroMonths.length / 2))
      const secondHalf = nonZeroMonths.slice(Math.floor(nonZeroMonths.length / 2))

      const firstHalfAvg = firstHalf.reduce((sum, m) => sum + m.averageRisk, 0) / firstHalf.length
      const secondHalfAvg =
        secondHalf.reduce((sum, m) => sum + m.averageRisk, 0) / secondHalf.length

      if (firstHalfAvg > 0) {
        trendPercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

        if (Math.abs(trendPercentage) < 5) {
          overallTrend = 'stable'
        } else if (trendPercentage > 0) {
          overallTrend = 'increasing'
        } else {
          overallTrend = 'decreasing'
        }
      }
    }

    // Calculate overall average risk for this questionnaire
    const allRiskValues = questionnaireSubmissions.map((s) => s.riskValue)
    const overallAverageRisk = calculateAverageRisk(allRiskValues)

    questionnaireRiskData.push({
      questionnaireName,
      questionnaireId: questionnaireName.toLowerCase().replace(/\s+/g, '-'),
      monthlyData: questionnaireMonthlyData,
      overallTrend,
      trendPercentage,
      averageRisk: overallAverageRisk,
      totalSubmissions: questionnaireSubmissions.length,
    })
  }

  const analyticsData = {
    totalUsers,
    totalSubmissions,
    riskDistribution,
    submissionsByQuestionnaire,
    monthlyData,
    questionnaireRiskData,
    averageScore:
      submissions.length > 0
        ? submissions.reduce((sum, s) => sum + s.totalScore, 0) / submissions.length
        : 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analíticas</h1>
        <p className="text-muted-foreground">
          Información integral y tendencias de las evaluaciones de riesgo de salud
        </p>
      </div>

      <AnalyticsOverview data={analyticsData} />

      <div className="grid gap-6 md:grid-cols-2">
        <RiskTrendsChart monthlyData={monthlyData} />
        <QuestionnairePerformance submissionsByQuestionnaire={submissionsByQuestionnaire} />
      </div>

      <QuestionnaireRiskTrends questionnaireRiskData={analyticsData.questionnaireRiskData} />
    </div>
  )
}
