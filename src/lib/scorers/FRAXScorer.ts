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
    let hipFractureRisk = this.calculateBaseHipFractureRisk(age, sex, bmi)

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
        hipFractureRisk *= Math.min(multiplier, 1.4) // Hip fracture has lower multipliers
      }
    })

    // Apply BMD adjustment if available
    if (bmdTScore !== null) {
      const bmdMultiplier = this.calculateBMDMultiplier(bmdTScore)
      majorFractureRisk *= bmdMultiplier
      hipFractureRisk *= bmdMultiplier
    }

    // Cap risks at reasonable maximums
    majorFractureRisk = Math.min(majorFractureRisk, 60)
    hipFractureRisk = Math.min(hipFractureRisk, 30)

    // Round to one decimal place
    majorFractureRisk = Math.round(majorFractureRisk * 10) / 10
    hipFractureRisk = Math.round(hipFractureRisk * 10) / 10

    // Use major fracture risk as the primary score for risk categorization
    const risk = this.interpretMajorFractureRisk(majorFractureRisk)
    const interpretation = this.getInterpretation(majorFractureRisk, hipFractureRisk, risk)

    return {
      score: majorFractureRisk,
      risk,
      interpretation,
    }
  }

  private getAgeValue(): number {
    const ageRange = this.getAnswerValue('age')

    // Return midpoint of age range
    switch (ageRange) {
      case 'under_40':
        return 30 // Use 30 as representative age for under 40
      case '40-44':
        return 42
      case '45-49':
        return 47
      case '50-54':
        return 52
      case '55-59':
        return 57
      case '60-64':
        return 62
      case '65-69':
        return 67
      case '70-74':
        return 72
      case '75-79':
        return 77
      case '80-84':
        return 82
      case '85-90':
        return 87
      default:
        return 65 // default fallback
    }
  }

  private getBMIValue(): number {
    const bmiRange = this.getAnswerValue('bmi')

    // Return representative BMI value for each range
    switch (bmiRange) {
      case 'under_19':
        return 18
      case '19-25':
        return 22
      case '25-30':
        return 27.5
      case '30-35':
        return 32.5
      case 'over_35':
        return 37
      default:
        return 25 // default fallback
    }
  }

  private getBMDTScore(): number | null {
    const bmdCategory = this.getAnswerValue('bmd_t_score')

    switch (bmdCategory) {
      case 'not_available':
        return null
      case 'above_minus_1':
        return -0.5
      case 'minus_1_to_minus_2.5':
        return -1.75
      case 'below_minus_2.5':
        return -3.0
      default:
        return null
    }
  }

  private calculateBaseMajorFractureRisk(age: number, sex: string, bmi: number): number {
    let baseRisk: number

    if (sex === 'female') {
      // Base risk increases exponentially with age for females
      baseRisk = Math.exp((age - 40) * 0.08 - 3.5)

      // BMI adjustment - lower BMI increases risk
      if (bmi < 20) {
        baseRisk *= 1.5
      } else if (bmi < 25) {
        baseRisk *= 1.2
      } else if (bmi > 30) {
        baseRisk *= 0.8
      }
    } else {
      // Base risk for males (generally lower than females)
      baseRisk = Math.exp((age - 40) * 0.07 - 4.0)

      // BMI adjustment for males
      if (bmi < 20) {
        baseRisk *= 1.3
      } else if (bmi < 25) {
        baseRisk *= 1.1
      } else if (bmi > 30) {
        baseRisk *= 0.9
      }
    }

    return Math.max(baseRisk, 0.5) // Minimum risk
  }

  private calculateBaseHipFractureRisk(age: number, sex: string, bmi: number): number {
    let baseRisk: number

    if (sex === 'female') {
      // Hip fracture risk increases more steeply with age
      baseRisk = Math.exp((age - 50) * 0.12 - 4.5)

      // BMI has stronger effect on hip fracture
      if (bmi < 20) {
        baseRisk *= 2.0
      } else if (bmi < 25) {
        baseRisk *= 1.4
      } else if (bmi > 30) {
        baseRisk *= 0.6
      }
    } else {
      // Males have lower hip fracture risk
      baseRisk = Math.exp((age - 50) * 0.1 - 5.0)

      if (bmi < 20) {
        baseRisk *= 1.6
      } else if (bmi < 25) {
        baseRisk *= 1.2
      } else if (bmi > 30) {
        baseRisk *= 0.7
      }
    }

    return Math.max(baseRisk, 0.1) // Minimum risk
  }

  private calculateBMDMultiplier(tScore: number): number {
    // Each SD decrease in BMD approximately doubles fracture risk
    // T-score of -2.5 = osteoporosis threshold
    if (tScore >= -1) {
      return 0.8 // Above normal reduces risk
    } else if (tScore >= -2.5) {
      return Math.exp((-1 - tScore) * 0.6) // Exponential increase
    } else {
      return Math.exp((-1 - -2.5) * 0.6 + (-2.5 - tScore) * 0.8) // Steeper increase in osteoporotic range
    }
  }

  private interpretMajorFractureRisk(risk: number): string {
    if (risk < 10) {
      return 'Low Risk'
    } else if (risk <= 20) {
      return 'Moderate Risk'
    } else {
      return 'High Risk'
    }
  }

  private interpretHipFractureRisk(risk: number): string {
    if (risk < 3) {
      return 'Low Risk'
    } else if (risk <= 5) {
      return 'Moderate Risk'
    } else {
      return 'High Risk'
    }
  }

  private getInterpretation(majorRisk: number, hipRisk: number, riskCategory: string): string {
    const age = this.getAgeValue()

    // Special handling for under 40
    if (age < 40) {
      let interpretation = `At your age (under 40), fracture risk assessment using FRAX is typically not recommended as fracture risk is generally very low in this age group. `
      interpretation += `Your calculated 10-year risk is ${majorRisk}% for major osteoporotic fracture and ${hipRisk}% for hip fracture, but these values should be interpreted with caution. `
      interpretation += `Focus on building and maintaining strong bones through adequate calcium and vitamin D intake, regular weight-bearing exercise, avoiding smoking, and limiting alcohol consumption. `
      interpretation += `If you have specific risk factors or concerns about bone health, consult with your healthcare provider for personalized advice.`
      return interpretation
    }

    let interpretation = `Your FRAX assessment shows a ${majorRisk}% 10-year risk of major osteoporotic fracture and ${hipRisk}% 10-year risk of hip fracture. `
    interpretation += `This indicates ${riskCategory.toLowerCase()}. `

    const hipRiskCategory = this.interpretHipFractureRisk(hipRisk)
    const isHighRisk = riskCategory === 'High Risk' || hipRiskCategory === 'High Risk'
    const isModerateRisk = riskCategory === 'Moderate Risk' || hipRiskCategory === 'Moderate Risk'

    if (isHighRisk) {
      interpretation += 'Treatment with anti-osteoporotic medication is recommended. '
      interpretation += 'Consider bisphosphonates as first-line therapy. '
      interpretation +=
        'Ensure adequate calcium (1000-1200mg/day) and vitamin D (800-1000 IU/day) intake. '
      interpretation +=
        'Implement fall prevention strategies and engage in regular weight-bearing and resistance exercises. '
      interpretation += 'Annual monitoring and reassessment are essential.'
    } else if (isModerateRisk) {
      interpretation +=
        'Consider treatment based on additional clinical factors and patient preferences. '
      interpretation +=
        'Lifestyle modifications are important including adequate calcium and vitamin D supplementation. '
      interpretation +=
        'Regular weight-bearing exercise and fall prevention measures should be implemented. '
      interpretation += 'Reassess fracture risk in 1-2 years or if clinical status changes.'
    } else {
      interpretation += 'Focus on prevention through healthy lifestyle measures. '
      interpretation +=
        'Maintain adequate calcium and vitamin D intake, engage in regular physical activity including weight-bearing exercises. '
      interpretation +=
        'Implement fall prevention strategies such as home safety measures and balance training. '
      interpretation += 'Avoid excessive alcohol consumption and smoking cessation if applicable. '
      interpretation += 'Reassess fracture risk in 2-5 years or if risk factors change.'
    }

    // Add BMD recommendation if not available
    const bmdCategory = this.getAnswerValue('bmd_t_score')
    if (bmdCategory === 'not_available') {
      interpretation +=
        ' Consider bone density testing (DEXA scan) for more accurate fracture risk assessment.'
    }

    return interpretation
  }

  /**
   * Get detailed fracture risk results for display
   */
  public getDetailedResults(): {
    majorFractureRisk: number
    hipFractureRisk: number
    majorFractureCategory: string
    hipFractureCategory: string
    overallRisk: string
    clinicalAction: string
    bmi: number
  } {
    const age = this.getAgeValue()
    const sex = this.getAnswerValue('sex')
    const bmi = this.getBMIValue()

    const previousFracture = this.getAnswerValue('previous_fracture') === 'yes'
    const parentHipFracture = this.getAnswerValue('parent_hip_fracture') === 'yes'
    const currentSmoking = this.getAnswerValue('current_smoking') === 'yes'
    const glucocorticoids = this.getAnswerValue('glucocorticoids') === 'yes'
    const rheumatoidArthritis = this.getAnswerValue('rheumatoid_arthritis') === 'yes'
    const secondaryOsteoporosis = this.getAnswerValue('secondary_osteoporosis') === 'yes'
    const alcohol = this.getAnswerValue('alcohol') === 'yes'
    const bmdTScore = this.getBMDTScore()

    let majorFractureRisk = this.calculateBaseMajorFractureRisk(age, sex, bmi)
    let hipFractureRisk = this.calculateBaseHipFractureRisk(age, sex, bmi)

    const riskFactors = {
      previousFracture: previousFracture ? 1.8 : 1.0,
      parentHipFracture: parentHipFracture ? 1.5 : 1.0,
      currentSmoking: currentSmoking ? 1.3 : 1.0,
      glucocorticoids: glucocorticoids ? 1.6 : 1.0,
      rheumatoidArthritis: rheumatoidArthritis ? 1.4 : 1.0,
      secondaryOsteoporosis: secondaryOsteoporosis ? 1.5 : 1.0,
      alcohol: alcohol ? 1.2 : 1.0,
    }

    Object.values(riskFactors).forEach((multiplier) => {
      majorFractureRisk *= multiplier
      if (multiplier > 1.0) {
        hipFractureRisk *= Math.min(multiplier, 1.4)
      }
    })

    if (bmdTScore !== null) {
      const bmdMultiplier = this.calculateBMDMultiplier(bmdTScore)
      majorFractureRisk *= bmdMultiplier
      hipFractureRisk *= bmdMultiplier
    }

    majorFractureRisk = Math.min(Math.round(majorFractureRisk * 10) / 10, 60)
    hipFractureRisk = Math.min(Math.round(hipFractureRisk * 10) / 10, 30)

    const majorFractureCategory = this.interpretMajorFractureRisk(majorFractureRisk)
    const hipFractureCategory = this.interpretHipFractureRisk(hipFractureRisk)

    const overallRisk =
      majorFractureCategory === 'High Risk' || hipFractureCategory === 'High Risk'
        ? 'High Risk'
        : majorFractureCategory === 'Moderate Risk' || hipFractureCategory === 'Moderate Risk'
          ? 'Moderate Risk'
          : 'Low Risk'

    const clinicalAction = this.getClinicalAction(majorFractureRisk, hipFractureRisk)

    return {
      majorFractureRisk,
      hipFractureRisk,
      majorFractureCategory,
      hipFractureCategory,
      overallRisk,
      clinicalAction,
      bmi: Math.round(bmi * 10) / 10,
    }
  }

  private getClinicalAction(majorRisk: number, hipRisk: number): string {
    if (majorRisk > 20 || hipRisk > 5) {
      return 'Treatment recommended - Consider anti-osteoporotic therapy'
    } else if (majorRisk > 10 || hipRisk > 3) {
      return 'Consider treatment based on additional clinical factors'
    } else {
      return 'Lifestyle measures and reassessment in 2-5 years'
    }
  }
}
