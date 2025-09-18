import type { QuestionnaireSubmission } from '@/payload-types'

export interface RiskResult {
  score: number
  risk: string
  interpretation: string
}

export class BaseScorer {
  constructor(protected readonly questionnaireSubmission: QuestionnaireSubmission) {
    this.questionnaireSubmission = questionnaireSubmission
  }

  public calculateRisk(): RiskResult {
    throw new Error('Not implemented')
  }
}
