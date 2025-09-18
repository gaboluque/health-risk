import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'

export interface RiskResult {
  score: number
  risk: string
  interpretation: string
}

export class BaseScorer {
  constructor(
    protected readonly questionnaireSubmission: QuestionnaireSubmission,
    protected readonly formData: FormData,
  ) {
    this.questionnaireSubmission = questionnaireSubmission
    this.formData = formData
  }

  public calculateRisk(): RiskResult {
    throw new Error('Not implemented')
  }

  /**
   * Get the selected answer value for a specific question ID
   * @param questionId - The ID of the question
   * @returns The selected answer value or empty string if not found
   */
  protected getAnswerValue(questionId: string): string {
    return this.formData.answers[questionId] || ''
  }
}
