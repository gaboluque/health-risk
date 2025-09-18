import { BaseScorer } from './BaseScorer'
import type { RiskResult } from '@/lib/types/questionnaire'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'

/**
 * FRAX (Fracture Risk Assessment Tool) Scorer
 * Calculates 10-year probability of major osteoporotic fracture and hip fracture
 *
 * Note: This is a simplified implementation for educational purposes.
 * For clinical use, please use the official FRAX calculator at frax.shef.ac.uk
 */
export class FRAXScorer extends BaseScorer {
  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }

  calculateRisk(): RiskResult {
    // Get demographic and clinical data
    const age = this.getAgeValue()
    const sex = this.getAnswerValue('sex')
    const bmi = this.getBMIValue()

    // Get risk factors
    const previousFracture = this.getAnswerValue('previous_fracture') === 'yes'
    const parentHipFracture = this.getAnswerValue('parent_hip_fracture') === 'yes'
    const currentSmoking = this.getAnswerValue('current_smoking') === 'yes'
    const glucocorticoids = this.getAnswerValue('glucocorticoids') === 'yes'
    const rheumatoidArthritis = this.getAnswerValue('rheumatoid_arthritis') === 'yes'
    const secondaryOsteoporosis = this.getAnswerValue('secondary_osteoporosis') === 'yes'
    const alcohol = this.getAnswerValue('alcohol') === 'yes'
    const bmdTScore = this.getBMDTScore()

    // Calculate base risks
    let majorFractureRisk = this.calculateBaseMajorFractureRisk(age, sex, bmi)
    let _hipFractureRisk = this.calculateBaseHipFractureRisk(age, sex, bmi)

    // Apply risk factor multipliers
    const riskFactors = {
      previousFracture: previousFracture ? 1.8 : 1.0,
      parentHipFracture: parentHipFracture ? 1.5 : 1.0,
      currentSmoking: currentSmoking ? 1.3 : 1.0,
      glucocorticoids: glucocorticoids ? 1.6 : 1.0,
      rheumatoidArthritis: rheumatoidArthritis ? 1.4 : 1.0,
      secondaryOsteoporosis: secondaryOsteoporosis ? 1.5 : 1.0,
      alcohol: alcohol ? 1.2 : 1.0,
    }

    // Apply risk factor multipliers
    Object.values(riskFactors).forEach((multiplier) => {
      majorFractureRisk *= multiplier
      if (multiplier > 1.0) {
        _hipFractureRisk *= Math.min(multiplier, 1.4) // Hip fracture has lower multipliers
      }
    })

    // Apply BMD adjustment if available
    if (bmdTScore !== null) {
      const bmdMultiplier = this.calculateBMDMultiplier(bmdTScore)
      majorFractureRisk *= bmdMultiplier
      _hipFractureRisk *= bmdMultiplier
    }

    // Cap risks at reasonable maximums
    majorFractureRisk = Math.min(majorFractureRisk, 60)
    _hipFractureRisk = Math.min(_hipFractureRisk, 30)

    // Round to one decimal place
    majorFractureRisk = Math.round(majorFractureRisk * 10) / 10
    _hipFractureRisk = Math.round(_hipFractureRisk * 10) / 10

    // Use major fracture risk as the primary score for risk categorization
    const risk = this.interpretMajorFractureRisk(majorFractureRisk)

    return {
      score: majorFractureRisk,
      risk,
    }
  }

  private getAgeValue(): number {
    const ageStr = this.getAnswerValue('age')
    const age = parseInt(ageStr, 10)
    return isNaN(age) ? 50 : Math.max(40, Math.min(90, age)) // Clamp between 40-90
  }

  private getBMIValue(): number {
    const heightStr = this.getAnswerValue('height')
    const weightStr = this.getAnswerValue('weight')

    const height = parseFloat(heightStr)
    const weight = parseFloat(weightStr)

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      return 25 // Default BMI if invalid input
    }

    const bmi = weight / (height * height)
    return Math.max(15, Math.min(40, bmi)) // Clamp between 15-40
  }

  private getBMDTScore(): number | null {
    const bmdStr = this.getAnswerValue('bmd_t_score')
    if (!bmdStr || bmdStr === 'unknown') return null

    const bmd = parseFloat(bmdStr)
    return isNaN(bmd) ? null : Math.max(-4, Math.min(4, bmd)) // Clamp between -4 to 4
  }

  private calculateBaseMajorFractureRisk(age: number, sex: string, bmi: number): number {
    // Simplified base risk calculation
    let baseRisk = 0

    // Age factor (exponential increase with age)
    if (age < 50) {
      baseRisk = 1
    } else if (age < 60) {
      baseRisk = 2 + (age - 50) * 0.3
    } else if (age < 70) {
      baseRisk = 5 + (age - 60) * 0.5
    } else if (age < 80) {
      baseRisk = 10 + (age - 70) * 0.8
    } else {
      baseRisk = 18 + (age - 80) * 1.2
    }

    // Sex adjustment (women have higher risk, especially post-menopause)
    if (sex === 'female') {
      if (age >= 50) {
        baseRisk *= 1.5
      }
    }

    // BMI adjustment (low BMI increases risk)
    if (bmi < 20) {
      baseRisk *= 1.3
    } else if (bmi > 30) {
      baseRisk *= 0.9
    }

    return Math.max(0.1, baseRisk)
  }

  private calculateBaseHipFractureRisk(age: number, sex: string, bmi: number): number {
    // Hip fracture risk is typically lower and more age-dependent
    let baseRisk = this.calculateBaseMajorFractureRisk(age, sex, bmi) * 0.3

    // Additional age weighting for hip fractures
    if (age >= 75) {
      baseRisk *= 1.5
    }

    return Math.max(0.1, baseRisk)
  }

  private calculateBMDMultiplier(tScore: number): number {
    // BMD T-score adjustment (each SD decrease increases risk)
    // T-score of -1 = ~1.5x risk, -2 = ~2.5x risk, -3 = ~4x risk
    if (tScore >= -1) {
      return 1.0
    } else if (tScore >= -2) {
      return 1.0 + (-tScore - 1) * 0.5
    } else if (tScore >= -3) {
      return 1.5 + (-tScore - 2) * 1.0
    } else {
      return 2.5 + (-tScore - 3) * 1.5
    }
  }

  private interpretMajorFractureRisk(risk: number): string {
    if (risk < 10) {
      return 'Low Risk'
    } else if (risk < 20) {
      return 'Moderate Risk'
    } else {
      return 'High Risk'
    }
  }
}
