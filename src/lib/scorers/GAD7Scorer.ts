import { BaseScorer } from './BaseScorer'
import type { RiskResult } from '@/lib/types/questionnaire'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'

/**
 * GAD-7 (Generalized Anxiety Disorder 7-item) Scorer
 * 7-item self-report questionnaire to screen for and assess severity of generalized anxiety disorder
 *
 * Scoring:
 * - Each item scored 0-3 (Not at all=0, Several days=1, More than half=2, Nearly every day=3)
 * - Total score range: 0-21
 * - Severity categories: Minimal (0-4), Mild (5-9), Moderate (10-14), Severe (15-21)
 * - Score ≥10 indicates probable GAD (sensitivity 89%, specificity 82%)
 */
export class GAD7Scorer extends BaseScorer {
  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }

  calculateRisk(): RiskResult {
    // Get individual question responses
    const feelingNervous = this.getAnswerValue('feeling_nervous')
    const uncontrollableWorrying = this.getAnswerValue('uncontrollable_worrying')
    const worryingTooMuch = this.getAnswerValue('worrying_too_much')
    const troubleRelaxing = this.getAnswerValue('trouble_relaxing')
    const restlessness = this.getAnswerValue('restlessness')
    const easilyAnnoyed = this.getAnswerValue('easily_annoyed')
    const feelingAfraid = this.getAnswerValue('feeling_afraid')

    // Calculate individual question scores
    const scores = {
      q1_feelingNervous: this.getFrequencyScore(feelingNervous),
      q2_uncontrollableWorrying: this.getFrequencyScore(uncontrollableWorrying),
      q3_worryingTooMuch: this.getFrequencyScore(worryingTooMuch),
      q4_troubleRelaxing: this.getFrequencyScore(troubleRelaxing),
      q5_restlessness: this.getFrequencyScore(restlessness),
      q6_easilyAnnoyed: this.getFrequencyScore(easilyAnnoyed),
      q7_feelingAfraid: this.getFrequencyScore(feelingAfraid),
    }

    // Calculate total score
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

    // Determine severity category
    const severityCategory = this.determineSeverityCategory(totalScore)

    return {
      score: totalScore,
      risk: severityCategory,
      standardRiskLevel: this.mapToStandardRiskLevel(severityCategory),
      riskDescription: this.getSeverityDescription(totalScore),
    }
  }

  private getFrequencyScore(frequency: string): number {
    // Convert frequency strings to numeric scores
    switch (frequency) {
      case 'not':
        return 0 // Not at all
      case 'several':
        return 1 // Several days
      case 'more_than_half':
        return 2 // More than half the days
      case 'nearly_every':
        return 3 // Nearly every day
      default:
        return 0
    }
  }

  private getFrequencyDescription(frequency: string): string {
    const descriptions = {
      not: 'Not at all',
      several: 'Several days',
      more_than_half: 'More than half the days',
      nearly_every: 'Nearly every day',
    }
    return descriptions[frequency as keyof typeof descriptions] || 'Not specified'
  }

  private determineSeverityCategory(totalScore: number): string {
    if (totalScore >= 0 && totalScore <= 4) {
      return 'Minimal Anxiety'
    } else if (totalScore >= 5 && totalScore <= 9) {
      return 'Mild Anxiety'
    } else if (totalScore >= 10 && totalScore <= 14) {
      return 'Moderate Anxiety'
    } else if (totalScore >= 15 && totalScore <= 21) {
      return 'Severe Anxiety'
    } else {
      return 'Invalid Score'
    }
  }

  private getSeverityDescription(totalScore: number): string {
    if (totalScore >= 0 && totalScore <= 4) {
      return 'Minimal anxiety symptoms. No treatment needed.'
    } else if (totalScore >= 5 && totalScore <= 9) {
      return 'Mild anxiety symptoms. Watchful waiting and self-help recommended.'
    } else if (totalScore >= 10 && totalScore <= 14) {
      return 'Moderate anxiety symptoms. Consider counseling or medication.'
    } else if (totalScore >= 15 && totalScore <= 21) {
      return 'Severe anxiety symptoms. Treatment strongly recommended.'
    } else {
      return 'Invalid score range'
    }
  }
}
