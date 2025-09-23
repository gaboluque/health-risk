import { BaseScorer } from './BaseScorer'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'
import { RiskLevel, type RiskResult } from '@/lib/types/questionnaire'

/**
 * Oswestry Disability Index (ODI) Scorer
 *
 * The ODI is the most commonly used outcome measure for low back pain disability.
 * Originally developed by Jeremy Fairbank et al. in 1980 and revised in 2000.
 *
 * Key Features:
 * - 10 sections assessing functional activities affected by low back pain
 * - Each section scored 0-5 (0 = no disability, 5 = maximum disability)
 * - Total score converted to percentage (0-100%)
 * - Considered "gold standard" for low back functional outcome tools
 *
 * Scoring Method:
 * Score = (Total Points / Maximum Possible Points) × 100
 * Maximum possible = 50 points (10 sections × 5 points each)
 * If sections missed: Maximum possible = (Number of completed sections × 5)
 *
 * Clinical Interpretation:
 * 0-20%: Minimal disability
 * 21-40%: Moderate disability
 * 41-60%: Severe disability
 * 61-80%: Crippled
 * 81-100%: Bed-bound or symptom exaggeration
 *
 * Minimum Detectable Change: 10 percentage points
 *
 * References:
 * - Fairbank JCT, Pynsent PB. The Oswestry Disability Index. Spine. 2000;25(22):2940-2953.
 * - Davidson M, Keating JL. Comparison of five low back disability questionnaires. Phys Ther. 2002;82(1):8-24.
 */
export class ODIScorer extends BaseScorer {
  // Section scoring mapping: answer value -> points
  private readonly sectionScoring = {
    pain_intensity: {
      no_pain: 0,
      mild_pain: 1,
      moderate_pain: 2,
      fairly_severe: 3,
      very_severe: 4,
      worst_imaginable: 5,
    },
    personal_care: {
      normal_no_pain: 0,
      normal_extra_pain: 1,
      slow_careful: 2,
      need_some_help: 3,
      need_daily_help: 4,
      stay_in_bed: 5,
    },
    lifting: {
      heavy_no_pain: 0,
      heavy_extra_pain: 1,
      convenient_position: 2,
      light_medium_convenient: 3,
      very_light_only: 4,
      cannot_lift: 5,
    },
    walking: {
      any_distance: 0,
      more_than_2km: 1,
      more_than_1km: 2,
      more_than_500m: 3,
      need_stick_crutches: 4,
      bed_most_time: 5,
    },
    sitting: {
      any_chair_long: 0,
      favorite_chair_long: 1,
      more_than_hour: 2,
      more_than_30min: 3,
      more_than_10min: 4,
      cannot_sit: 5,
    },
    standing: {
      long_no_pain: 0,
      long_extra_pain: 1,
      more_than_hour: 2,
      more_than_30min: 3,
      more_than_10min: 4,
      cannot_stand: 5,
    },
    sleeping: {
      never_disturbed: 0,
      occasionally_disturbed: 1,
      less_than_6hrs: 2,
      less_than_4hrs: 3,
      less_than_2hrs: 4,
      prevents_sleeping: 5,
    },
    sex_life: {
      normal_no_pain: 0,
      normal_some_pain: 1,
      nearly_normal_painful: 2,
      severely_restricted: 3,
      nearly_absent: 4,
      prevents_all: 5,
    },
    social_life: {
      normal_no_pain: 0,
      normal_increases_pain: 1,
      limits_energetic: 2,
      restricted_less_often: 3,
      restricted_to_home: 4,
      no_social_life: 5,
    },
    travelling: {
      anywhere_no_pain: 0,
      anywhere_extra_pain: 1,
      journeys_over_2hrs: 2,
      less_than_hour: 3,
      short_necessary_30min: 4,
      only_for_treatment: 5,
    },
  }

  // All possible section IDs in order
  private readonly sectionIds = [
    'pain_intensity',
    'personal_care',
    'lifting',
    'walking',
    'sitting',
    'standing',
    'sleeping',
    'sex_life',
    'social_life',
    'travelling',
  ]

  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }

  calculateRisk(): RiskResult {
    const { totalScore, maxPossibleScore } = this.calculateODIScore()

    // Calculate percentage score
    const percentageScore = (totalScore / maxPossibleScore) * 100

    // Round to one decimal place
    const roundedScore = Math.round(percentageScore * 10) / 10

    // Determine disability level
    const disabilityLevel = this.interpretODIScore(roundedScore)

    return {
      score: roundedScore,
      riskLevel: disabilityLevel,
      riskValue: this.getRiskValue(disabilityLevel),
      riskDescription: this.getRiskDescription(disabilityLevel),
    }
  }

  /**
   * Calculate the raw ODI score and related metrics
   */
  private calculateODIScore(): {
    totalScore: number
    maxPossibleScore: number
    completedSections: number
  } {
    let totalScore = 0
    let completedSections = 0

    for (const sectionId of this.sectionIds) {
      const answer = this.getAnswerValue(sectionId)

      // Check if section was answered
      if (answer && answer.trim() !== '') {
        const sectionPoints = this.getSectionScore(sectionId, answer)

        // Handle case where multiple answers might be selected
        // According to ODI instructions: "If a patient marks more than one statement
        // in a question, the highest scoring statement is recorded"
        totalScore += sectionPoints
        completedSections++
      }
    }

    // Calculate maximum possible score based on completed sections
    // For every unanswered section, reduce denominator by 5
    const maxPossibleScore = completedSections * 5

    return {
      totalScore,
      maxPossibleScore,
      completedSections,
    }
  }

  /**
   * Get the score for a specific section
   */
  private getSectionScore(sectionId: string, answer: string): number {
    const sectionMapping = this.sectionScoring[sectionId as keyof typeof this.sectionScoring]

    if (!sectionMapping) {
      console.warn(`Unknown section ID: ${sectionId}`)
      return 0
    }

    const score = sectionMapping[answer as keyof typeof sectionMapping]

    if (score === undefined) {
      console.warn(`Unknown answer value: ${answer} for section: ${sectionId}`)
      return 0
    }

    return score
  }

  /**
   * Interpret ODI percentage score into disability classification
   * Maps ODI disability levels to the system's RiskLevel enum
   */
  private interpretODIScore(percentageScore: number): RiskResult['riskLevel'] {
    if (percentageScore <= 20) {
      return RiskLevel.MINIMAL // Discapacidad Mínima
    } else if (percentageScore <= 40) {
      return RiskLevel.LOW // Discapacidad Moderada
    } else if (percentageScore <= 60) {
      return RiskLevel.MODERATE // Discapacidad Severa
    } else if (percentageScore <= 80) {
      return RiskLevel.HIGH // Incapacitado
    } else {
      return RiskLevel.SEVERE // Completamente Discapacitado
    }
  }

  /**
   * Get individual section scores for detailed analysis
   * Useful for identifying specific areas of functional impairment
   */
  public getSectionBreakdown(): Array<{
    sectionId: string
    sectionName: string
    score: number
    maxScore: number
    percentage: number
    answered: boolean
  }> {
    const sectionNames = {
      pain_intensity: 'Intensidad del Dolor',
      personal_care: 'Cuidado Personal',
      lifting: 'Levantar Objetos',
      walking: 'Caminar',
      sitting: 'Sentarse',
      standing: 'Estar de Pie',
      sleeping: 'Dormir',
      sex_life: 'Vida Sexual',
      social_life: 'Vida Social',
      travelling: 'Viajar',
    }

    return this.sectionIds.map((sectionId) => {
      const answer = this.getAnswerValue(sectionId)
      const answered = !!(answer && answer.trim() !== '')
      const score = answered ? this.getSectionScore(sectionId, answer) : 0
      const maxScore = 5
      const percentage = answered ? (score / maxScore) * 100 : 0

      return {
        sectionId,
        sectionName: sectionNames[sectionId as keyof typeof sectionNames],
        score,
        maxScore,
        percentage: Math.round(percentage * 10) / 10,
        answered,
      }
    })
  }

  /**
   * Validate ODI responses and provide feedback
   */
  public validateResponses(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    completionRate: number
  } {
    const errors: string[] = []
    const warnings: string[] = []
    let answeredSections = 0

    for (const sectionId of this.sectionIds) {
      const answer = this.getAnswerValue(sectionId)

      if (answer && answer.trim() !== '') {
        answeredSections++

        // Validate that the answer exists in our scoring system
        const sectionMapping = this.sectionScoring[sectionId as keyof typeof this.sectionScoring]
        if (!sectionMapping || !(answer in sectionMapping)) {
          errors.push(`Respuesta inválida en sección ${sectionId}: ${answer}`)
        }
      } else if (sectionId !== 'sex_life') {
        // Sex life section is optional, others should be completed
        warnings.push(`Sección no completada: ${sectionId}`)
      }
    }

    const completionRate = (answeredSections / this.sectionIds.length) * 100

    // According to ODI guidelines, at least 8 sections should be completed for valid scoring
    if (answeredSections < 8) {
      errors.push(
        `Se requieren al menos 8 secciones completadas para un puntaje válido. Completadas: ${answeredSections}`,
      )
    }

    return {
      isValid: errors.length === 0 && answeredSections >= 8,
      errors,
      warnings,
      completionRate: Math.round(completionRate * 10) / 10,
    }
  }

  /**
   * Determine if change in ODI score is clinically meaningful
   */
  public static isClinicalleMeaningfulChange(
    baseline: number,
    followUp: number,
  ): {
    isMeaningful: boolean
    change: number
    interpretation: string
  } {
    const change = baseline - followUp // Positive = improvement
    const absoluteChange = Math.abs(change)

    // Minimum detectable change is 10 percentage points
    const isMeaningful = absoluteChange >= 10

    let interpretation = ''
    if (!isMeaningful) {
      interpretation = 'Cambio no significativo clínicamente (< 10 puntos)'
    } else if (change > 0) {
      interpretation = `Mejora clínicamente significativa de ${absoluteChange.toFixed(1)} puntos`
    } else {
      interpretation = `Empeoramiento clínicamente significativo de ${absoluteChange.toFixed(1)} puntos`
    }

    return {
      isMeaningful,
      change: Math.round(change * 10) / 10,
      interpretation,
    }
  }
}
