'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { ASCVDScorer } from '@/lib/scorers/ASCVDScorer'
import type { QuestionnaireSubmission } from '@/payload-types'

interface SubmitASCVDParams {
  questionnaire: {
    id: string
    name: string
    questions: Array<{
      id: string
      label: string
      options: Array<{
        value: string
        label: string
      }>
    }>
  }
  formData: {
    firstName: string
    lastName: string
    email: string
    answers: Record<string, string>
  }
}

export async function submitASCVDQuestionnaire(params: SubmitASCVDParams) {
  try {
    const { questionnaire, formData } = params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

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
        score: 0, // ASCVD doesn't use simple scoring, it uses the complex algorithm
      }
    })

    // Calculate total score (not really used for ASCVD, but required by schema)
    const totalScore = submittedAnswers.reduce((sum, answer) => sum + answer.score, 0)

    // First, ensure the ASCVD questionnaire exists in the database
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

    // Create the questionnaire submission in the database
    const submission = (await payload.create({
      collection: 'questionnaire-submissions',
      data: {
        questionnaire: questionnaireDoc.docs[0].id, // Use the actual database document ID
        submittedAnswers,
        totalScore,
        submittedBy: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
      },
    })) as QuestionnaireSubmission

    // Now run the ASCVD scorer
    const scorer = new ASCVDScorer(submission)
    const riskResult = scorer.calculateRisk()

    return {
      success: true,
      data: {
        submission: {
          id: submission.id,
          submittedBy: submission.submittedBy,
        },
        riskResult,
      },
    }
  } catch (error) {
    console.error('Error submitting ASCVD questionnaire:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
