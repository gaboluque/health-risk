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

    const interpretation = this.getInterpretation(totalScore, severityCategory, scores)

    return {
      score: totalScore,
      risk: severityCategory,
      interpretation,
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

  private getInterpretation(
    totalScore: number,
    severityCategory: string,
    scores: Record<string, number>,
  ): string {
    let interpretation = `Your GAD-7 assessment shows a total score of ${totalScore}/21 points, indicating ${severityCategory.toLowerCase()}. `

    // Add severity-specific interpretation
    if (severityCategory === 'Minimal Anxiety') {
      interpretation += `This score suggests minimal anxiety symptoms that are within the normal range. `
      interpretation += `There is no indication of a clinically significant anxiety disorder at this time. `
      interpretation += `**Recommended approach:** No specific treatment is indicated. Continue with current coping strategies and maintain healthy lifestyle habits. `
      interpretation += `Monitor for any increase in symptoms, especially during times of stress. `
      interpretation += `Consider lifestyle factors that promote mental wellness such as regular exercise, adequate sleep, and stress management techniques. `
    } else if (severityCategory === 'Mild Anxiety') {
      interpretation += `This score suggests mild anxiety symptoms that may indicate mild GAD or adjustment disorder with anxiety. `
      interpretation += `While symptoms are present, they likely cause minimal functional impairment. `
      interpretation += `**Recommended approach:** Self-help strategies may be sufficient at this level. `
      interpretation += `Consider psychoeducation about anxiety and stress management, lifestyle modifications including regular exercise and good sleep hygiene. `
      interpretation += `Relaxation techniques, mindfulness practices, and self-help resources may be beneficial. `
      interpretation += `Monitor symptoms over 2-4 weeks and consider professional help if symptoms persist or worsen. `
    } else if (severityCategory === 'Moderate Anxiety') {
      interpretation += `This score likely indicates GAD or another anxiety disorder with moderate functional impairment in daily activities. `
      interpretation += `This level of anxiety symptoms is clinically significant and screening is positive for probable GAD. `
      interpretation += `**Recommended approach:** Professional evaluation is recommended. `
      interpretation += `Consider psychotherapy, particularly Cognitive Behavioral Therapy (CBT), which is first-line treatment for GAD. `
      interpretation += `Medication evaluation may be appropriate, typically with SSRI or SNRI antidepressants. `
      interpretation += `A comprehensive mental health assessment should rule out medical causes of anxiety and other psychiatric conditions. `
    } else if (severityCategory === 'Severe Anxiety') {
      interpretation += `This score indicates severe anxiety symptoms with significant functional impairment and distress. `
      interpretation += `There is a strong indication of GAD or other severe anxiety disorder requiring immediate attention. `
      interpretation += `**Recommended approach:** Immediate professional evaluation is required. `
      interpretation += `Strong consideration for medication (antidepressants) combined with intensive psychotherapy. `
      interpretation += `Specialist referral to a psychiatrist may be appropriate. Close monitoring for safety and treatment response is essential. `
      interpretation += `Comprehensive treatment planning with possible family involvement is recommended. `
    }

    // Add screening results interpretation
    const isScreenPositive = totalScore >= 10
    interpretation += `\n\n**GAD-7 Screening Result:** ${isScreenPositive ? 'POSITIVE' : 'NEGATIVE'} `
    interpretation += `(cutoff score: ≥10 points). `
    if (isScreenPositive) {
      interpretation += `This positive screen suggests probable GAD and warrants further clinical evaluation. `
      interpretation += `The GAD-7 has 89% sensitivity and 82% specificity for detecting GAD. `
    } else {
      interpretation += `This negative screen suggests GAD is less likely, though clinical judgment should always be used. `
    }

    // Add symptom domain analysis
    const symptomAnalysis = this.getSymptomDomainAnalysis(scores)
    if (symptomAnalysis.length > 0) {
      interpretation += `\n\n**Key symptom areas identified:** ${symptomAnalysis.join(', ')}. `
      interpretation += `Addressing these specific symptom domains can help guide treatment focus. `
    }

    // Add follow-up recommendations
    interpretation += this.getFollowUpRecommendations(severityCategory)

    return interpretation
  }

  private getSymptomDomainAnalysis(scores: Record<string, number>): string[] {
    const domains: string[] = []

    // Cognitive symptoms (worry and control)
    const cognitiveScore =
      scores.q2_uncontrollableWorrying + scores.q3_worryingTooMuch + scores.q7_feelingAfraid
    if (cognitiveScore >= 4) {
      domains.push('Excessive worry and catastrophic thinking')
    }

    // Physical symptoms
    const physicalScore =
      scores.q1_feelingNervous + scores.q4_troubleRelaxing + scores.q5_restlessness
    if (physicalScore >= 4) {
      domains.push('Physical tension and restlessness')
    }

    // Irritability
    if (scores.q6_easilyAnnoyed >= 2) {
      domains.push('Increased irritability')
    }

    return domains
  }

  private getFollowUpRecommendations(severityCategory: string): string {
    switch (severityCategory) {
      case 'Minimal Anxiety':
        return `\n\n**Follow-up:** Routine screening as clinically indicated. Return if symptoms worsen or new stressors emerge.`

      case 'Mild Anxiety':
        return `\n\n**Follow-up:** Re-assess with GAD-7 in 4-6 weeks. Consider brief counseling or self-help interventions. Seek professional help if symptoms persist or worsen.`

      case 'Moderate Anxiety':
        return `\n\n**Follow-up:** Mental health referral recommended. Follow-up in 2-4 weeks to monitor treatment response. Regular GAD-7 monitoring during treatment.`

      case 'Severe Anxiety':
        return `\n\n**Follow-up:** Urgent mental health referral. Close follow-up within 1-2 weeks initially. Weekly monitoring during treatment initiation. Provide crisis contact information.`

      default:
        return ''
    }
  }

  /**
   * Get detailed GAD-7 results for display
   */
  public getDetailedResults(): {
    totalScore: number
    maxScore: number
    severityCategory: string
    screeningPositive: boolean
    clinicalActions: string[]
    breakdown: {
      questions: Record<
        string,
        {
          question: string
          answer: string
          score: number
          maxScore: number
          domain: string
          significance: string
        }
      >
      symptomDomains: {
        cognitiveSymptoms: {
          questions: string[]
          totalScore: number
          maxScore: number
          description: string
        }
        physicalSymptoms: {
          questions: string[]
          totalScore: number
          maxScore: number
          description: string
        }
        emotionalSymptoms: {
          questions: string[]
          totalScore: number
          maxScore: number
          description: string
        }
      }
    }
    recommendations: string[]
    followUpGuidance: {
      followUpInterval: string
      monitoringParameters: string
      redFlagSigns: string
      nextSteps: string
    }
  } {
    const feelingNervous = this.getAnswerValue('feeling_nervous')
    const uncontrollableWorrying = this.getAnswerValue('uncontrollable_worrying')
    const worryingTooMuch = this.getAnswerValue('worrying_too_much')
    const troubleRelaxing = this.getAnswerValue('trouble_relaxing')
    const restlessness = this.getAnswerValue('restlessness')
    const easilyAnnoyed = this.getAnswerValue('easily_annoyed')
    const feelingAfraid = this.getAnswerValue('feeling_afraid')

    const scores = {
      q1_feelingNervous: this.getFrequencyScore(feelingNervous),
      q2_uncontrollableWorrying: this.getFrequencyScore(uncontrollableWorrying),
      q3_worryingTooMuch: this.getFrequencyScore(worryingTooMuch),
      q4_troubleRelaxing: this.getFrequencyScore(troubleRelaxing),
      q5_restlessness: this.getFrequencyScore(restlessness),
      q6_easilyAnnoyed: this.getFrequencyScore(easilyAnnoyed),
      q7_feelingAfraid: this.getFrequencyScore(feelingAfraid),
    }

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const severityCategory = this.determineSeverityCategory(totalScore)

    return {
      totalScore,
      maxScore: 21,
      severityCategory,
      screeningPositive: totalScore >= 10,
      clinicalActions: this.getClinicalActions(severityCategory),
      breakdown: this.getGAD7Breakdown(scores, {
        feelingNervous,
        uncontrollableWorrying,
        worryingTooMuch,
        troubleRelaxing,
        restlessness,
        easilyAnnoyed,
        feelingAfraid,
      }),
      recommendations: this.getRecommendations(severityCategory),
      followUpGuidance: this.getFollowUpGuidance(severityCategory),
    }
  }

  private getClinicalActions(severityCategory: string): string[] {
    switch (severityCategory) {
      case 'Minimal Anxiety':
        return [
          'No immediate clinical action required',
          'Provide reassurance about normal anxiety levels',
          'Education about when to seek help',
          'Routine screening at future visits',
        ]

      case 'Mild Anxiety':
        return [
          'Provide psychoeducation materials',
          'Discuss self-help strategies',
          'Schedule follow-up in 4-6 weeks',
          'Consider brief intervention or counseling referral',
        ]

      case 'Moderate Anxiety':
        return [
          'Refer for mental health evaluation',
          'Consider medication evaluation',
          'Schedule follow-up in 2-4 weeks',
          'Provide crisis contact information',
          'Document functional impairment',
        ]

      case 'Severe Anxiety':
        return [
          'Urgent mental health referral',
          'Consider same-day psychiatric consultation',
          'Evaluate for immediate safety concerns',
          'Discuss medication options',
          'Close follow-up within 1-2 weeks',
          'Provide crisis intervention resources',
        ]

      default:
        return ['Consult with supervisor or specialist']
    }
  }

  private getRecommendations(severityCategory: string): string[] {
    switch (severityCategory) {
      case 'Minimal Anxiety':
        return [
          'No specific treatment indicated at this time',
          'Continue with current coping strategies',
          'Monitor for any increase in symptoms',
          'Consider lifestyle factors that promote mental wellness',
          'Regular exercise and stress management techniques',
          'Maintain social connections and support systems',
          'Re-screen if symptoms worsen or life stressors increase',
        ]

      case 'Mild Anxiety':
        return [
          'Self-help strategies may be sufficient',
          'Psychoeducation about anxiety and stress management',
          'Lifestyle modifications (exercise, sleep hygiene, stress reduction)',
          'Relaxation techniques and mindfulness practices',
          'Consider self-help books or online resources',
          'Monitor symptoms over 2-4 weeks',
          'Consider professional help if symptoms persist or worsen',
          'Brief counseling may be beneficial',
        ]

      case 'Moderate Anxiety':
        return [
          'Professional evaluation recommended',
          'Consider psychotherapy (CBT is first-line treatment)',
          'Evaluate need for medication (SSRI/SNRI)',
          'Comprehensive mental health assessment',
          'Rule out medical causes of anxiety',
          'Consider combination of therapy and medication',
          'Regular monitoring and follow-up',
          'Workplace or academic accommodations if needed',
          'Family education and support',
        ]

      case 'Severe Anxiety':
        return [
          'Immediate professional evaluation required',
          'Strong consideration for medication (antidepressants)',
          'Intensive psychotherapy (CBT or other evidence-based approaches)',
          'Rule out other psychiatric conditions',
          'Medical evaluation to exclude organic causes',
          'Consider specialist referral (psychiatrist)',
          'Close monitoring for safety and treatment response',
          'Possible short-term anxiolytic medication',
          'Comprehensive treatment planning',
          'Family involvement in treatment planning',
        ]

      default:
        return ['Score requires review - consult with healthcare provider']
    }
  }

  private getGAD7Breakdown(
    scores: Record<string, number>,
    answers: {
      feelingNervous: string
      uncontrollableWorrying: string
      worryingTooMuch: string
      troubleRelaxing: string
      restlessness: string
      easilyAnnoyed: string
      feelingAfraid: string
    },
  ) {
    return {
      questions: {
        q1_feelingNervous: {
          question: 'Feeling nervous, anxious, or on edge',
          answer: this.getFrequencyDescription(answers.feelingNervous),
          score: scores.q1_feelingNervous,
          maxScore: 3,
          domain: 'General Anxiety',
          significance:
            scores.q1_feelingNervous > 0
              ? 'Indicates general anxiety symptoms'
              : 'No general anxiety reported',
        },
        q2_uncontrollableWorrying: {
          question: 'Not being able to stop or control worrying',
          answer: this.getFrequencyDescription(answers.uncontrollableWorrying),
          score: scores.q2_uncontrollableWorrying,
          maxScore: 3,
          domain: 'Worry Control',
          significance:
            scores.q2_uncontrollableWorrying > 0
              ? 'Suggests difficulty controlling worry - key GAD symptom'
              : 'Good worry control',
        },
        q3_worryingTooMuch: {
          question: 'Worrying too much about different things',
          answer: this.getFrequencyDescription(answers.worryingTooMuch),
          score: scores.q3_worryingTooMuch,
          maxScore: 3,
          domain: 'Excessive Worry',
          significance:
            scores.q3_worryingTooMuch > 0
              ? 'Excessive worry across multiple domains'
              : 'Worry within normal limits',
        },
        q4_troubleRelaxing: {
          question: 'Trouble relaxing',
          answer: this.getFrequencyDescription(answers.troubleRelaxing),
          score: scores.q4_troubleRelaxing,
          maxScore: 3,
          domain: 'Relaxation Difficulty',
          significance:
            scores.q4_troubleRelaxing > 0
              ? 'Physical tension and relaxation difficulties'
              : 'Able to relax normally',
        },
        q5_restlessness: {
          question: "Being so restless that it's hard to sit still",
          answer: this.getFrequencyDescription(answers.restlessness),
          score: scores.q5_restlessness,
          maxScore: 3,
          domain: 'Motor Agitation',
          significance:
            scores.q5_restlessness > 0
              ? 'Physical restlessness and agitation'
              : 'No motor agitation',
        },
        q6_easilyAnnoyed: {
          question: 'Becoming easily annoyed or irritable',
          answer: this.getFrequencyDescription(answers.easilyAnnoyed),
          score: scores.q6_easilyAnnoyed,
          maxScore: 3,
          domain: 'Irritability',
          significance:
            scores.q6_easilyAnnoyed > 0
              ? 'Increased irritability - common in anxiety'
              : 'Normal irritability levels',
        },
        q7_feelingAfraid: {
          question: 'Feeling afraid as if something awful might happen',
          answer: this.getFrequencyDescription(answers.feelingAfraid),
          score: scores.q7_feelingAfraid,
          maxScore: 3,
          domain: 'Anticipatory Anxiety',
          significance:
            scores.q7_feelingAfraid > 0
              ? 'Catastrophic thinking and anticipatory anxiety'
              : 'No catastrophic fears',
        },
      },
      symptomDomains: {
        cognitiveSymptoms: {
          questions: ['q2_uncontrollableWorrying', 'q3_worryingTooMuch', 'q7_feelingAfraid'],
          totalScore:
            scores.q2_uncontrollableWorrying + scores.q3_worryingTooMuch + scores.q7_feelingAfraid,
          maxScore: 9,
          description: 'Worry, uncontrollable thoughts, and catastrophic thinking',
        },
        physicalSymptoms: {
          questions: ['q1_feelingNervous', 'q4_troubleRelaxing', 'q5_restlessness'],
          totalScore: scores.q1_feelingNervous + scores.q4_troubleRelaxing + scores.q5_restlessness,
          maxScore: 9,
          description: 'Physical tension, restlessness, and somatic anxiety',
        },
        emotionalSymptoms: {
          questions: ['q6_easilyAnnoyed'],
          totalScore: scores.q6_easilyAnnoyed,
          maxScore: 3,
          description: 'Irritability and emotional reactivity',
        },
      },
    }
  }

  private getFollowUpGuidance(severityCategory: string): {
    followUpInterval: string
    monitoringParameters: string
    redFlagSigns: string
    nextSteps: string
  } {
    const guidance = {
      'Minimal Anxiety': {
        followUpInterval: 'Routine screening (annually or as indicated)',
        monitoringParameters: 'Life stressors, symptom changes',
        redFlagSigns: 'New onset of anxiety symptoms, functional impairment',
        nextSteps: 'Continue current strategies, lifestyle maintenance',
      },
      'Mild Anxiety': {
        followUpInterval: '4-6 weeks',
        monitoringParameters: 'Symptom progression, functional impact, treatment response',
        redFlagSigns: 'Worsening symptoms, emergence of panic, functional decline',
        nextSteps: 'Re-assess with GAD-7, consider brief intervention',
      },
      'Moderate Anxiety': {
        followUpInterval: '2-4 weeks initially, then monthly',
        monitoringParameters: 'Treatment response, side effects, functional improvement',
        redFlagSigns: 'Suicidal ideation, panic attacks, severe impairment',
        nextSteps: 'Mental health referral, consider medication, regular GAD-7 monitoring',
      },
      'Severe Anxiety': {
        followUpInterval: '1-2 weeks initially, then bi-weekly',
        monitoringParameters: 'Safety, treatment adherence, rapid response assessment',
        redFlagSigns: 'Suicidal thoughts, complete functional breakdown, treatment resistance',
        nextSteps: 'Urgent specialty referral, comprehensive treatment plan, close monitoring',
      },
    }

    return guidance[severityCategory as keyof typeof guidance] || guidance['Minimal Anxiety']
  }
}
