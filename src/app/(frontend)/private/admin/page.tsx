import { getPayload } from 'payload'
import config from '@/payload.config'
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview'
import { RiskTrendsChart } from '@/components/admin/RiskTrendsChart'
import { QuestionnairePerformance } from '@/components/admin/QuestionnairePerformance'

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
      acc[submission.standardRiskLevel] = (acc[submission.standardRiskLevel] || 0) + 1
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
        (s) => s.standardRiskLevel === 'high' || s.standardRiskLevel === 'very-high',
      ).length,
    })
  }

  const analyticsData = {
    totalUsers,
    totalSubmissions,
    riskDistribution,
    submissionsByQuestionnaire,
    monthlyData,
    averageScore:
      submissions.length > 0
        ? submissions.reduce((sum, s) => sum + s.totalScore, 0) / submissions.length
        : 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights and trends from health risk assessments
        </p>
      </div>

      <AnalyticsOverview data={analyticsData} />

      <div className="grid gap-6 md:grid-cols-2">
        <RiskTrendsChart monthlyData={monthlyData} />
        <QuestionnairePerformance submissionsByQuestionnaire={submissionsByQuestionnaire} />
      </div>
    </div>
  )
}
