import { BaseScorer } from './BaseScorer'
import { RiskLevel, type RiskResult } from '@/lib/types/questionnaire'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'

/**
 * STarT Back Tool Scorer
 * 9-question prognostic tool for low back pain, stratifying patients into risk groups
 * for persistent disabling pain
 *
 * Risk categorization algorithm:
 * - Low Risk: Total score 0-3
 * - Medium Risk: Total score ≥4 AND psychosocial subscale ≤3
 * - High Risk: Psychosocial subscale ≥4
 */
export class STarTScorer extends BaseScorer {
  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }

  calculateRisk(): RiskResult {
    // Get individual question responses
    const legPain = this.getAnswerValue('leg_pain') === 'agree'
    const shoulderNeckPain = this.getAnswerValue('shoulder_neck_pain') === 'agree'
    const walkingLimited = this.getAnswerValue('walking_limited') === 'agree'
    const dressingSlower = this.getAnswerValue('dressing_slower') === 'agree'
    const fearActivity = this.getAnswerValue('fear_activity') === 'agree'
    const worryingThoughts = this.getAnswerValue('worrying_thoughts') === 'agree'
    const copingPoor = this.getAnswerValue('coping_poor') === 'agree'
    const enjoymentReduced = this.getAnswerValue('enjoyment_reduced') === 'agree'
    const bothersomeness = this.getAnswerValue('bothersomeness')

    // Calculate individual question scores
    const scores = {
      q1_legPain: legPain ? 1 : 0,
      q2_shoulderNeckPain: shoulderNeckPain ? 1 : 0,
      q3_walkingLimited: walkingLimited ? 1 : 0,
      q4_dressingSlower: dressingSlower ? 1 : 0,
      q5_fearActivity: fearActivity ? 1 : 0,
      q6_worryingThoughts: worryingThoughts ? 1 : 0,
      q7_copingPoor: copingPoor ? 1 : 0,
      q8_enjoymentReduced: enjoymentReduced ? 1 : 0,
      q9_bothersomeness: this.getBothersomenessScore(bothersomeness),
    }

    // Calculate total score (sum of all questions)
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

    // Calculate psychosocial subscale (Q5-Q9)
    const psychosocialScore =
      scores.q5_fearActivity +
      scores.q6_worryingThoughts +
      scores.q7_copingPoor +
      scores.q8_enjoymentReduced +
      scores.q9_bothersomeness

    // Determine risk category
    const risk = this.determineRiskCategory(totalScore, psychosocialScore)

    return {
      score: totalScore,
      riskLevel: risk,
      riskValue: this.getRiskValue(risk),
      riskDescription: this.getRiskDescription(risk),
    }
  }

  private getBothersomenessScore(bothersomeness: string): number {
    // Q9 scoring: Not at all (0), Slightly (0), Moderately (0), Very much (1), Extremely (1)
    switch (bothersomeness) {
      case 'not':
      case 'slightly':
      case 'moderately':
        return 0
      case 'very':
      case 'extremely':
        return 1
      default:
        return 0
    }
  }

  private determineRiskCategory(
    totalScore: number,
    psychosocialScore: number,
  ): RiskResult['riskLevel'] {
    if (psychosocialScore >= 4) {
      return RiskLevel.HIGH
    } else if (totalScore >= 4) {
      return RiskLevel.MODERATE
    } else {
      return RiskLevel.LOW
    }
  }
}
