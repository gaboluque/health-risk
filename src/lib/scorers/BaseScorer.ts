import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'
import { StandardRiskLevel } from '@/lib/types/questionnaire'

export interface RiskResult {
  score: number
  risk: string
  standardRiskLevel: StandardRiskLevel
  riskDescription?: string
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

  /**
   * Map questionnaire-specific risk levels to standardized risk levels
   * @param originalRisk - The original risk level from the questionnaire
   * @returns StandardRiskLevel
   */
  protected mapToStandardRiskLevel(originalRisk: string): StandardRiskLevel {
    const risk = originalRisk.toLowerCase()

    // Handle anxiety/mental health questionnaires
    if (risk.includes('minimal') || risk.includes('not at all')) {
      return StandardRiskLevel.MINIMAL
    }

    // Handle various forms of "low" risk
    if (risk.includes('low') || risk.includes('very low')) {
      return StandardRiskLevel.LOW
    }

    // Handle various forms of "moderate" risk
    if (
      risk.includes('moderate') ||
      risk.includes('medium') ||
      risk.includes('borderline') ||
      risk.includes('intermediate') ||
      risk.includes('slightly elevated') ||
      risk.includes('mild')
    ) {
      return StandardRiskLevel.MODERATE
    }

    // Handle high risk categories
    if (risk.includes('high') || risk.includes('medium-high')) {
      return StandardRiskLevel.HIGH
    }

    // Handle severe/very high risk
    if (risk.includes('severe') || risk.includes('very high') || risk.includes('extremely')) {
      return StandardRiskLevel.SEVERE
    }

    // Default fallback
    return StandardRiskLevel.LOW
  }
}
