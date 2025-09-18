'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { UserProfile } from '@/lib/types/user-profile'
import { findOrCreateUser } from '@/lib/services/user-service'

export interface UserSubmissionSummary {
  questionnaireId: string
  questionnaireName: string
  lastSubmission: {
    id: string
    standardRiskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
    riskLevel: string
    submittedAt: string
  } | null
}

export async function getUserSubmissions(
  userProfile: UserProfile,
): Promise<UserSubmissionSummary[]> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find the user based on profile information
    const { user } = await findOrCreateUser({ profile: userProfile })

    // Get all questionnaires
    const questionnairesResult = await payload.find({
      collection: 'questionnaires',
      limit: 100,
    })

    // Get all submissions for this user
    const submissionsResult = await payload.find({
      collection: 'questionnaire-submissions',
      where: {
        submittedBy: {
          equals: user.id,
        },
      },
      sort: '-createdAt',
      limit: 100,
    })

    // Create a map of questionnaire ID to latest submission
    const submissionMap = new Map<string, QuestionnaireSubmission>()

    for (const submission of submissionsResult.docs as QuestionnaireSubmission[]) {
      const questionnaireId =
        typeof submission.questionnaire === 'string'
          ? submission.questionnaire
          : submission.questionnaire.id

      // Only keep the latest submission for each questionnaire
      if (!submissionMap.has(questionnaireId)) {
        submissionMap.set(questionnaireId, submission)
      }
    }

    // Map questionnaire IDs to their names for easy lookup
    const questionnaireMap = new Map<string, string>()
    for (const questionnaire of questionnairesResult.docs) {
      questionnaireMap.set(questionnaire.id, questionnaire.name)
    }

    // Create result array with all questionnaires, including those without submissions
    const healthAssessmentIds = ['ascvd', 'findrisk', 'frax', 'gad7', 'start']

    // Define questionnaire name patterns to match against
    const questionnairePatterns = {
      ascvd: ['ascvd', 'cardiovascular', 'heart'],
      findrisk: ['findrisk', 'diabetes', 'diabético'],
      frax: ['frax', 'fracture', 'fractura', 'osteoporosis'],
      gad7: ['gad7', 'gad-7', 'ansiedad', 'anxiety'],
      start: ['start', 'espalda', 'back', 'dolor'],
    }

    const result: UserSubmissionSummary[] = []

    // Add questionnaires that have submissions
    for (const [questionnaireId, submission] of submissionMap) {
      const questionnaireName = questionnaireMap.get(questionnaireId) || 'Unknown'
      const lowerCaseName = questionnaireName.toLowerCase()

      // Check if this questionnaire matches any of our health assessments
      const matchingAssessment = healthAssessmentIds.find((assessmentId) => {
        const patterns = questionnairePatterns[assessmentId as keyof typeof questionnairePatterns]
        return patterns.some((pattern) => lowerCaseName.includes(pattern))
      })

      if (matchingAssessment) {
        result.push({
          questionnaireId: matchingAssessment, // Use the matching assessment ID instead of the database ID
          questionnaireName,
          lastSubmission: {
            id: submission.id,
            standardRiskLevel: submission.standardRiskLevel,
            riskLevel: submission.riskLevel,
            submittedAt: submission.createdAt,
          },
        })
      }
    }

    // Add questionnaires without submissions
    for (const assessmentId of healthAssessmentIds) {
      const patterns = questionnairePatterns[assessmentId as keyof typeof questionnairePatterns]
      const hasSubmission = result.some((item) => {
        const lowerCaseName = item.questionnaireName.toLowerCase()
        return patterns.some((pattern) => lowerCaseName.includes(pattern))
      })

      if (!hasSubmission) {
        result.push({
          questionnaireId: assessmentId,
          questionnaireName: assessmentId,
          lastSubmission: null,
        })
      }
    }

    return result
  } catch (error) {
    console.error('Error fetching user submissions:', error)
    return []
  }
}
