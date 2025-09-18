import { BaseScorer } from './BaseScorer'
import type { RiskResult } from '@/lib/types/questionnaire'
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
    const riskCategory = this.determineRiskCategory(totalScore, psychosocialScore)

    const interpretation = this.getInterpretation(
      totalScore,
      psychosocialScore,
      riskCategory,
      scores,
    )

    return {
      score: totalScore,
      risk: riskCategory,
      interpretation,
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

  private determineRiskCategory(totalScore: number, psychosocialScore: number): string {
    // Risk categorization algorithm:
    // Low Risk: Total score 0-3
    // Medium Risk: Total score ≥4 AND psychosocial subscale ≤3
    // High Risk: Psychosocial subscale ≥4

    if (psychosocialScore >= 4) {
      return 'High Risk'
    } else if (totalScore >= 4 && psychosocialScore <= 3) {
      return 'Medium Risk'
    } else {
      return 'Low Risk'
    }
  }

  private getInterpretation(
    totalScore: number,
    psychosocialScore: number,
    riskCategory: string,
    scores: Record<string, number>,
  ): string {
    let interpretation = `Your STarT Back assessment shows a total score of ${totalScore}/9 points with a psychosocial subscale score of ${psychosocialScore}/5 points. `
    interpretation += `This indicates ${riskCategory.toLowerCase()}. `

    // Add specific interpretation based on risk category
    if (riskCategory === 'High Risk') {
      interpretation += `You have a high risk (78.4% likelihood) of persistent disabling low back pain without appropriate intervention. `
      interpretation += `The presence of significant psychological barriers including fear-avoidance beliefs, catastrophic thinking, or mood changes requires specialized attention. `
      interpretation += `**Recommended approach:** Psychologically-informed physiotherapy is essential. This should include cognitive-behavioral approaches, graded exposure to feared activities, and addressing psychological barriers to recovery. `
      interpretation += `Consider referral to a psychology specialist if available. A multi-disciplinary team approach may be needed, with treatment likely requiring 3-6 months or longer. `
      interpretation += `Focus should be on functional improvement rather than complete pain elimination. `
    } else if (riskCategory === 'Medium Risk') {
      interpretation += `You have a moderate risk (53.2% likelihood) of persistent disabling problems. `
      interpretation += `Your symptoms show mixed physical and some psychological factors that may affect recovery. `
      interpretation += `**Recommended approach:** Standard physiotherapy treatment is recommended, focusing on structured exercise programs and manual therapy techniques as appropriate. `
      interpretation += `Treatment should include education about pain management and gradual activity progression. `
      interpretation += `Monitor response to treatment at 4-6 weeks and consider work-focused interventions if needed. `
      interpretation += `The goal is to restore function even if some pain persists, with treatment typically taking 4-12 weeks. `
    } else {
      interpretation += `You have a low risk (16.7% likelihood) of developing persistent disabling low back pain. `
      interpretation += `Your symptoms are predominantly physical with good coping strategies in place. `
      interpretation += `**Recommended approach:** Self-management strategies are most appropriate. Focus on staying active and continuing normal activities as much as possible. `
      interpretation += `Simple pain relief medications can be used as needed. Educational materials about the natural course of back pain can be helpful. `
      interpretation += `Most people in this category recover well within 2-6 weeks with minimal intervention. `
      interpretation += `Follow-up is only needed if symptoms worsen or persist beyond 6 weeks. `
    }

    // Add specific psychological factor insights
    const psychologicalFactors = this.getActiveFactors(scores)
    if (psychologicalFactors.length > 0) {
      interpretation += `\n\n**Key factors identified:** ${psychologicalFactors.join(', ')}. `
      interpretation += `Addressing these psychological aspects is important for optimal recovery. `
    }

    // Add follow-up recommendations
    interpretation += this.getFollowUpRecommendations(riskCategory)

    return interpretation
  }

  private getActiveFactors(scores: Record<string, number>): string[] {
    const factors: string[] = []

    if (scores.q5_fearActivity) factors.push('Fear of physical activity')
    if (scores.q6_worryingThoughts) factors.push('Anxiety and worry')
    if (scores.q7_copingPoor) factors.push('Catastrophic thinking')
    if (scores.q8_enjoymentReduced) factors.push('Reduced enjoyment/possible depression')
    if (scores.q9_bothersomeness) factors.push('High pain bothersomeness')

    return factors
  }

  private getFollowUpRecommendations(riskCategory: string): string {
    switch (riskCategory) {
      case 'High Risk':
        return `\n\n**Follow-up schedule:** Initial review in 2-4 weeks to assess early response, then every 2-4 weeks initially, transitioning to monthly reviews. Extended treatment period of 3-6 months or longer may be required.`

      case 'Medium Risk':
        return `\n\n**Follow-up schedule:** Review in 4-6 weeks to assess response to physiotherapy, then every 4-6 weeks during treatment. Expected treatment duration is 6-12 weeks.`

      case 'Low Risk':
        return `\n\n**Follow-up schedule:** No routine follow-up required. Return if symptoms worsen or persist beyond 6 weeks. Self-initiated contact as needed for concerns.`

      default:
        return ''
    }
  }

  /**
   * Get detailed STarT Back results for display
   */
  public getDetailedResults(): {
    totalScore: number
    maxTotalScore: number
    psychosocialScore: number
    maxPsychosocialScore: number
    riskCategory: string
    expectedDisabilityRisk: string
    clinicalActions: string[]
    breakdown: {
      physicalFactors: Record<
        string,
        {
          question: string
          answer: string
          score: number
          significance: string
        }
      >
      psychosocialFactors: Record<
        string,
        {
          question: string
          answer: string
          score: number
          significance: string
          category: string
        }
      >
    }
    prognosis: {
      persistentDisability: string
      typicalOutcome: string
      expectedTimeframe: string
      keyFactors: string
    }
  } {
    const legPain = this.getAnswerValue('leg_pain') === 'agree'
    const shoulderNeckPain = this.getAnswerValue('shoulder_neck_pain') === 'agree'
    const walkingLimited = this.getAnswerValue('walking_limited') === 'agree'
    const dressingSlower = this.getAnswerValue('dressing_slower') === 'agree'
    const fearActivity = this.getAnswerValue('fear_activity') === 'agree'
    const worryingThoughts = this.getAnswerValue('worrying_thoughts') === 'agree'
    const copingPoor = this.getAnswerValue('coping_poor') === 'agree'
    const enjoymentReduced = this.getAnswerValue('enjoyment_reduced') === 'agree'
    const bothersomeness = this.getAnswerValue('bothersomeness')

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

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const psychosocialScore =
      scores.q5_fearActivity +
      scores.q6_worryingThoughts +
      scores.q7_copingPoor +
      scores.q8_enjoymentReduced +
      scores.q9_bothersomeness
    const riskCategory = this.determineRiskCategory(totalScore, psychosocialScore)

    return {
      totalScore,
      maxTotalScore: 9,
      psychosocialScore,
      maxPsychosocialScore: 5,
      riskCategory,
      expectedDisabilityRisk: this.getExpectedDisabilityRisk(riskCategory),
      clinicalActions: this.getClinicalActions(riskCategory),
      breakdown: this.getSTarTBackBreakdown(scores, {
        legPain,
        shoulderNeckPain,
        walkingLimited,
        dressingSlower,
        fearActivity,
        worryingThoughts,
        copingPoor,
        enjoymentReduced,
        bothersomeness,
      }),
      prognosis: this.getPrognosticInformation(riskCategory),
    }
  }

  private getExpectedDisabilityRisk(riskCategory: string): string {
    switch (riskCategory) {
      case 'Low Risk':
        return '16.7%'
      case 'Medium Risk':
        return '53.2%'
      case 'High Risk':
        return '78.4%'
      default:
        return 'Unknown'
    }
  }

  private getClinicalActions(riskCategory: string): string[] {
    switch (riskCategory) {
      case 'Low Risk':
        return [
          'Provide reassurance and education',
          'Give patient information leaflet',
          'Advise to stay active and continue normal activities',
          'Suggest simple pain relief if needed',
          'Advise to return if not improving in 6 weeks',
        ]

      case 'Medium Risk':
        return [
          'Refer to physiotherapy',
          'Provide education about back pain',
          'Ensure appropriate pain management',
          'Consider work-related factors',
          'Schedule review in 4-6 weeks',
        ]

      case 'High Risk':
        return [
          'Refer to specialized physiotherapy service',
          'Consider psychology referral',
          'Ensure comprehensive pain assessment',
          'Address psychological barriers early',
          'Consider multi-disciplinary team approach',
          'Schedule closer follow-up (2-4 weeks)',
        ]

      default:
        return []
    }
  }

  private getSTarTBackBreakdown(
    scores: Record<string, number>,
    answers: {
      legPain: boolean
      shoulderNeckPain: boolean
      walkingLimited: boolean
      dressingSlower: boolean
      fearActivity: boolean
      worryingThoughts: boolean
      copingPoor: boolean
      enjoymentReduced: boolean
      bothersomeness: string
    },
  ) {
    return {
      physicalFactors: {
        q1_legPain: {
          question: 'My back pain has spread down my leg(s) at some time in the last 2 weeks',
          answer: answers.legPain ? 'Agree' : 'Disagree',
          score: scores.q1_legPain,
          significance: answers.legPain
            ? 'Indicates possible nerve involvement'
            : 'No radiating pain',
        },
        q2_shoulderNeckPain: {
          question: 'I have had pain in the shoulder or neck at some time in the last 2 weeks',
          answer: answers.shoulderNeckPain ? 'Agree' : 'Disagree',
          score: scores.q2_shoulderNeckPain,
          significance: answers.shoulderNeckPain
            ? 'Suggests widespread pain pattern'
            : 'Pain localized to back',
        },
        q3_walkingLimited: {
          question: 'I have only walked short distances because of my back pain',
          answer: answers.walkingLimited ? 'Agree' : 'Disagree',
          score: scores.q3_walkingLimited,
          significance: answers.walkingLimited
            ? 'Significant functional limitation'
            : 'Walking not limited',
        },
        q4_dressingSlower: {
          question:
            'In the last 2 weeks, I have dressed more slowly than usual because of back pain',
          answer: answers.dressingSlower ? 'Agree' : 'Disagree',
          score: scores.q4_dressingSlower,
          significance: answers.dressingSlower
            ? 'Daily activities affected'
            : 'Daily activities maintained',
        },
      },
      psychosocialFactors: {
        q5_fearActivity: {
          question:
            "It's not really safe for a person with a condition like mine to be physically active",
          answer: answers.fearActivity ? 'Agree' : 'Disagree',
          score: scores.q5_fearActivity,
          significance: answers.fearActivity
            ? 'Fear-avoidance beliefs present'
            : 'No activity fears',
          category: 'Fear-Avoidance',
        },
        q6_worryingThoughts: {
          question: 'Worrying thoughts have been going through my mind a lot of the time',
          answer: answers.worryingThoughts ? 'Agree' : 'Disagree',
          score: scores.q6_worryingThoughts,
          significance: answers.worryingThoughts
            ? 'Anxiety symptoms present'
            : 'No excessive worry',
          category: 'Anxiety',
        },
        q7_copingPoor: {
          question: "I feel that my back pain is terrible and it's never going to get any better",
          answer: answers.copingPoor ? 'Agree' : 'Disagree',
          score: scores.q7_copingPoor,
          significance: answers.copingPoor
            ? 'Catastrophic thinking present'
            : 'Positive outlook maintained',
          category: 'Catastrophizing',
        },
        q8_enjoymentReduced: {
          question: 'In general I have not enjoyed all the things I used to enjoy',
          answer: answers.enjoymentReduced ? 'Agree' : 'Disagree',
          score: scores.q8_enjoymentReduced,
          significance: answers.enjoymentReduced
            ? 'Possible depression symptoms'
            : 'Mood maintained',
          category: 'Depression',
        },
        q9_bothersomeness: {
          question: 'Overall, how bothersome has your back pain been in the last 2 weeks?',
          answer: answers.bothersomeness.charAt(0).toUpperCase() + answers.bothersomeness.slice(1),
          score: scores.q9_bothersomeness,
          significance: scores.q9_bothersomeness
            ? 'High pain bothersomeness'
            : 'Manageable pain levels',
          category: 'Pain Impact',
        },
      },
    }
  }

  private getPrognosticInformation(riskCategory: string): {
    persistentDisability: string
    typicalOutcome: string
    expectedTimeframe: string
    keyFactors: string
  } {
    switch (riskCategory) {
      case 'Low Risk':
        return {
          persistentDisability: '16.7%',
          typicalOutcome: 'Most patients recover well with minimal intervention',
          expectedTimeframe: '2-6 weeks',
          keyFactors: 'Predominantly physical symptoms with good coping strategies',
        }

      case 'Medium Risk':
        return {
          persistentDisability: '53.2%',
          typicalOutcome: 'Mixed outcomes - some recover quickly, others may develop persistence',
          expectedTimeframe: '4-12 weeks with appropriate treatment',
          keyFactors: 'Mixed physical and some psychological factors present',
        }

      case 'High Risk':
        return {
          persistentDisability: '78.4%',
          typicalOutcome: 'High likelihood of persistent problems without appropriate intervention',
          expectedTimeframe: '3-6 months or longer',
          keyFactors:
            'Significant psychological barriers including fear, catastrophizing, and poor coping',
        }

      default:
        return {
          persistentDisability: 'Unknown',
          typicalOutcome: 'Unknown',
          expectedTimeframe: 'Unknown',
          keyFactors: 'Unknown',
        }
    }
  }
}
