'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { QuestionnaireSchema, FormData, SubmissionResponse } from '@/lib/types/questionnaire'
import { StandardRiskLevel } from '@/lib/types/questionnaire'
import type { UserProfile } from '@/lib/types/user-profile'
import { BaseScorer } from '@/lib/scorers/BaseScorer'
import { findOrCreateUser } from '@/lib/services/user-service'

interface SubmitQuestionnaireParams {
  questionnaire: QuestionnaireSchema
  formData: FormData
  userProfile: UserProfile
  scorerClass: new (submission: QuestionnaireSubmission, formData: FormData) => BaseScorer
}

export async function submitQuestionnaire({
  questionnaire,
  formData,
  userProfile,
  scorerClass,
}: SubmitQuestionnaireParams): Promise<SubmissionResponse> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find or create user based on the profile information
    const { user, isNewUser } = await findOrCreateUser({ profile: userProfile })

    // Create the submission data structure
    const submittedAnswers = questionnaire.questions.map((question, index) => {
      const selectedValue = formData.answers[question.id]
      const selectedOption = question.options.find((opt) => opt.value === selectedValue)

      if (!selectedOption) {
        throw new Error(`No option selected for question: ${question.label}`)
      }

      return {
        questionIndex: index,
        questionText: question.label,
        selectedAnswerIndex: question.options.findIndex((opt) => opt.value === selectedValue),
        selectedAnswerText: selectedOption.label,
        score: 0, // Most questionnaires don't use simple scoring, they use complex algorithms
      }
    })

    // Calculate total score (not really used for most questionnaires, but required by schema)
    const totalScore = submittedAnswers.reduce((sum, answer) => sum + answer.score, 0)

    // First, ensure the questionnaire exists in the database
    const questionnaireDoc = await payload.find({
      collection: 'questionnaires',
      where: {
        name: {
          equals: questionnaire.name,
        },
      },
    })

    // If questionnaire doesn't exist, create it
    if (questionnaireDoc.docs.length === 0) {
      questionnaireDoc.docs[0] = await payload.create({
        collection: 'questionnaires',
        data: {
          name: questionnaire.name,
          questions: questionnaire.questions.map((question) => ({
            text: question.label,
            possibleAnswers: question.options.map((option, index) => ({
              text: option.label,
              score: index, // Simple indexing for score
            })),
          })),
        },
      })
    }

    // Create a temporary submission to calculate risk
    const tempSubmission: QuestionnaireSubmission = {
      id: '',
      questionnaire: questionnaireDoc.docs[0].id,
      questionnaireName: questionnaire.name,
      submittedAnswers,
      totalScore,
      riskLevel: StandardRiskLevel.UNKNOWN,
      riskValue: 0,
      riskDescription: '',
      submittedBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Run the scorer to get risk information
    const scorer = new scorerClass(tempSubmission, formData)
    const riskResult = scorer.calculateRisk()

    // Create the questionnaire submission in the database with risk information
    const submission = (await payload.create({
      collection: 'questionnaire-submissions',
      data: {
        questionnaire: questionnaireDoc.docs[0].id, // Use the actual database document ID
        questionnaireName: questionnaire.name,
        submittedAnswers,
        totalScore,
        riskLevel: riskResult.riskLevel,
        riskValue: riskResult.riskValue,
        riskDescription: riskResult.riskDescription || '',
        submittedBy: user.id, // Reference the user by ID
      },
    })) as QuestionnaireSubmission

    return {
      success: true,
      data: {
        submission: {
          id: submission.id,
          submittedBy: user.id,
        },
        user: {
          id: user.id,
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          email: user.email,
          isNewUser,
        },
        riskResult,
      },
    }
  } catch (error) {
    console.error('Error submitting questionnaire:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
