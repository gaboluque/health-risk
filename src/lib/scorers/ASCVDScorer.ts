import { BaseScorer } from './BaseScorer'
import type { QuestionnaireSubmission } from '@/payload-types'
import { RiskResult, RiskLevel, type FormData } from '@/lib/types/questionnaire'

export interface ASCVDInputs {
  age: number
  sex: 'male' | 'female'
  race: 'white' | 'african_american' | 'other'
  totalCholesterol: number
  hdlCholesterol: number
  systolicBP: number
  onBPMeds: boolean
  diabetes: boolean
  smoker: boolean
}

/**
 * ASCVD Risk Calculator - Based on 2013 ACC/AHA Pooled Cohort Equations
 * Calculates 10-year risk of atherosclerotic cardiovascular disease
 */
export class ASCVDScorer extends BaseScorer {
  private readonly riskCategories = [
    {
      name: RiskLevel.MINIMAL,
      range: { min: 0, max: 1.9 },
    },
    {
      name: RiskLevel.LOW,
      range: { min: 2.0, max: 4.9 },
    },
    {
      name: RiskLevel.MODERATE,
      range: { min: 5.0, max: 7.4 },
    },
    {
      name: RiskLevel.HIGH,
      range: { min: 7.5, max: 19.9 },
    },
    {
      name: RiskLevel.SEVERE,
      range: { min: 20, max: 100 },
    },
  ]

  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }

  /**
   * Calculate ASCVD risk from questionnaire submission
   */
  public calculateRisk(): RiskResult {
    const inputs = this.mapSubmissionToInputs()
    this.validateInputs(inputs)

    const riskScore = this.calculateASCVDRisk(inputs)
    const risk = this.getRiskCategory(riskScore)

    return {
      score: riskScore,
      riskLevel: risk,
      riskValue: this.getRiskValue(risk),
      riskDescription: this.getRiskDescription(risk),
    }
  }

  /**
   * Map questionnaire submission to ASCVD inputs
   */
  private mapSubmissionToInputs(): ASCVDInputs {
    return {
      age: this.mapAgeToNumber(this.getAnswerValue('age')),
      sex: this.getAnswerValue('sex') as 'male' | 'female',
      race: this.getAnswerValue('race') as 'white' | 'african_american' | 'other',
      totalCholesterol: this.mapCholesterolToNumber(this.getAnswerValue('total_cholesterol')),
      hdlCholesterol: this.mapHDLToNumber(this.getAnswerValue('hdl_cholesterol')),
      systolicBP: this.mapBPToNumber(this.getAnswerValue('systolic_bp')),
      onBPMeds: this.getAnswerValue('bp_treatment') === 'yes',
      diabetes: this.getAnswerValue('diabetes') === 'yes',
      smoker: this.getAnswerValue('current_smoking') === 'yes',
    }
  }

  /**
   * Map age range to midpoint number
   */
  private mapAgeToNumber(ageRange: string): number {
    const ageMap: Record<string, number> = {
      under_40: 35, // Use 35 as representative age for under 40
      '40-44': 42,
      '45-49': 47,
      '50-54': 52,
      '55-59': 57,
      '60-64': 62,
      '65-69': 67,
      '70-74': 72,
      '75-79': 77,
    }
    return ageMap[ageRange] || 50
  }

  /**
   * Map total cholesterol range to midpoint number
   */
  private mapCholesterolToNumber(cholRange: string): number {
    const cholMap: Record<string, number> = {
      '<160': 150,
      '160-199': 180,
      '200-239': 220,
      '240-279': 260,
      '≥280': 300,
    }
    return cholMap[cholRange] || 200
  }

  /**
   * Map HDL cholesterol range to midpoint number
   */
  private mapHDLToNumber(hdlRange: string): number {
    const hdlMap: Record<string, number> = {
      '<40': 35,
      '40-49': 45,
      '50-59': 55,
      '≥60': 65,
    }
    return hdlMap[hdlRange] || 50
  }

  /**
   * Map systolic BP range to midpoint number
   */
  private mapBPToNumber(bpRange: string): number {
    const bpMap: Record<string, number> = {
      '<120': 110,
      '120-129': 125,
      '130-139': 135,
      '140-159': 150,
      '160-179': 170,
      '≥180': 190,
    }
    return bpMap[bpRange] || 120
  }

  /**
   * Validate ASCVD inputs
   */
  private validateInputs(inputs: ASCVDInputs): void {
    if (inputs.age < 18 || inputs.age > 79) {
      throw new Error('Age must be between 18-79 years')
    }
    if (inputs.totalCholesterol < 130 || inputs.totalCholesterol > 320) {
      throw new Error('Total cholesterol must be between 130-320 mg/dL')
    }
    if (inputs.hdlCholesterol < 20 || inputs.hdlCholesterol > 100) {
      throw new Error('HDL cholesterol must be between 20-100 mg/dL')
    }
    if (inputs.systolicBP < 90 || inputs.systolicBP > 200) {
      throw new Error('Systolic BP must be between 90-200 mmHg')
    }
  }

  /**
   * Calculate ASCVD risk using pooled cohort equations
   */
  private calculateASCVDRisk(inputs: ASCVDInputs): number {
    const {
      age,
      sex,
      race,
      totalCholesterol,
      hdlCholesterol,
      systolicBP,
      onBPMeds,
      diabetes,
      smoker,
    } = inputs

    // Coefficients for different demographic groups
    let coefficients: Record<string, number>
    let meanCoefficients: number
    let baselineSurvival: number

    if (sex === 'female') {
      if (race === 'african_american') {
        // African American Women
        coefficients = {
          lnAge: 17.1141,
          lnTotalChol: 0.9396,
          lnHDL: -18.9196,
          lnAgeTotalChol: -4.4748,
          lnAgeHDL: 4.4748,
          lnTreatedSysBP: 29.2907,
          lnUntreatedSysBP: 27.8197,
          lnAgeTreatedSysBP: -6.4321,
          lnAgeUntreatedSysBP: -6.0873,
          smoker: 0.6908,
          diabetes: 0.8738,
        }
        meanCoefficients = -86.6081
        baselineSurvival = 0.9533
      } else {
        // White/Other Women
        coefficients = {
          lnAge: -29.799,
          lnTotalChol: 4.884,
          lnHDL: -13.578,
          lnAgeTotalChol: -3.114,
          lnAgeHDL: 3.149,
          lnTreatedSysBP: 2.019,
          lnUntreatedSysBP: 1.957,
          lnAgeTreatedSysBP: 0,
          lnAgeUntreatedSysBP: 0,
          smoker: 7.574,
          lnAgeSmoker: -1.665,
          diabetes: 0.661,
        }
        meanCoefficients = -29.18
        baselineSurvival = 0.9665
      }
    } else {
      if (race === 'african_american') {
        // African American Men
        coefficients = {
          lnAge: 2.469,
          lnTotalChol: 0.302,
          lnHDL: -0.307,
          lnTreatedSysBP: 1.916,
          lnUntreatedSysBP: 1.809,
          smoker: 0.549,
          diabetes: 0.645,
        }
        meanCoefficients = 19.54
        baselineSurvival = 0.8954
      } else {
        // White/Other Men
        coefficients = {
          lnAge: 12.344,
          lnTotalChol: 11.853,
          lnHDL: -2.664,
          lnAgeTotalChol: -2.665,
          lnAgeHDL: 0.677,
          lnTreatedSysBP: 1.797,
          lnUntreatedSysBP: 1.764,
          smoker: 7.837,
          lnAgeSmoker: -1.795,
          diabetes: 0.658,
        }
        meanCoefficients = 61.18
        baselineSurvival = 0.9144
      }
    }

    // Calculate individual sum
    let individualSum = 0
    const lnAge = Math.log(age)
    const lnTotalChol = Math.log(totalCholesterol)
    const lnHDL = Math.log(hdlCholesterol)
    const lnSysBP = Math.log(systolicBP)

    individualSum += coefficients.lnAge * lnAge
    individualSum += coefficients.lnTotalChol * lnTotalChol
    individualSum += coefficients.lnHDL * lnHDL

    if (coefficients.lnAgeTotalChol) {
      individualSum += coefficients.lnAgeTotalChol * lnAge * lnTotalChol
    }
    if (coefficients.lnAgeHDL) {
      individualSum += coefficients.lnAgeHDL * lnAge * lnHDL
    }

    if (onBPMeds) {
      individualSum += coefficients.lnTreatedSysBP * lnSysBP
      if (coefficients.lnAgeTreatedSysBP) {
        individualSum += coefficients.lnAgeTreatedSysBP * lnAge * lnSysBP
      }
    } else {
      individualSum += coefficients.lnUntreatedSysBP * lnSysBP
      if (coefficients.lnAgeUntreatedSysBP) {
        individualSum += coefficients.lnAgeUntreatedSysBP * lnAge * lnSysBP
      }
    }

    if (smoker) {
      individualSum += coefficients.smoker
      if (coefficients.lnAgeSmoker) {
        individualSum += coefficients.lnAgeSmoker * lnAge
      }
    }

    if (diabetes) {
      individualSum += coefficients.diabetes
    }

    // Calculate 10-year risk
    const riskScore =
      (1 - Math.pow(baselineSurvival, Math.exp(individualSum - meanCoefficients))) * 100

    return Math.max(0, Math.min(100, Math.round(riskScore * 10) / 10))
  }

  /**
   * Get risk category based on score
   */
  private getRiskCategory(score: number) {
    return (
      this.riskCategories.find((cat) => score >= cat.range.min && score <= cat.range.max)?.name ||
      this.riskCategories[0].name
    )
  }
}
