import { BaseScorer } from './BaseScorer'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { RiskResult } from './BaseScorer'

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
      name: 'Low',
      range: { min: 0, max: 4.9 },
      description: 'Low 10-year risk of ASCVD',
    },
    {
      name: 'Medium',
      range: { min: 5.0, max: 7.4 },
      description: 'Borderline 10-year risk of ASCVD',
    },
    {
      name: 'Medium-High',
      range: { min: 7.5, max: 19.9 },
      description: 'Intermediate 10-year risk of ASCVD',
    },
    {
      name: 'High',
      range: { min: 20, max: 100 },
      description: 'High 10-year risk of ASCVD',
    },
  ]

  constructor(questionnaireSubmission: QuestionnaireSubmission) {
    super(questionnaireSubmission)
  }

  /**
   * Calculate ASCVD risk from questionnaire submission
   */
  public calculateRisk(): RiskResult {
    const inputs = this.mapSubmissionToInputs()
    this.validateInputs(inputs)

    const riskScore = this.calculateASCVDRisk(inputs)
    const risk = this.getRiskCategory(riskScore)
    const interpretation = this.getInterpretation(risk, inputs)

    return {
      score: riskScore,
      risk: risk.name,
      interpretation: interpretation,
    }
  }

  /**
   * Map questionnaire submission to ASCVD inputs
   */
  private mapSubmissionToInputs(): ASCVDInputs {
    const answers = this.questionnaireSubmission.submittedAnswers
    const answerMap = new Map(
      answers.map((answer) => [answer.questionText.toLowerCase(), answer.selectedAnswerText]),
    )

    // Helper function to get answer by question ID (approximate match)
    const getAnswer = (questionId: string): string => {
      for (const [key, value] of answerMap) {
        if (key.includes(questionId.toLowerCase())) {
          return value
        }
      }
      throw new Error(`Answer not found for question: ${questionId}`)
    }

    return {
      age: this.parseAgeRange(getAnswer('age')),
      sex: this.parseSex(getAnswer('sex')),
      race: this.parseRace(getAnswer('race')),
      totalCholesterol: this.parseCholesterolRange(getAnswer('total cholesterol')),
      hdlCholesterol: this.parseHDLRange(getAnswer('hdl cholesterol')),
      systolicBP: this.parseBPRange(getAnswer('systolic blood pressure')),
      onBPMeds: getAnswer('blood pressure treatment') === 'Yes',
      diabetes: getAnswer('diabetes') === 'Yes',
      smoker: getAnswer('current smoking') === 'Yes',
    }
  }

  /**
   * Parse age range to midpoint value
   */
  private parseAgeRange(ageRange: string): number {
    const ageMap: Record<string, number> = {
      '40-44 years': 42,
      '45-49 years': 47,
      '50-54 years': 52,
      '55-59 years': 57,
      '60-64 years': 62,
      '65-69 years': 67,
      '70-74 years': 72,
      '75-79 years': 77,
    }

    const age = ageMap[ageRange]
    if (!age) throw new Error(`Invalid age range: ${ageRange}`)
    return age
  }

  /**
   * Parse sex selection
   */
  private parseSex(sex: string): 'male' | 'female' {
    if (sex.toLowerCase() === 'male') return 'male'
    if (sex.toLowerCase() === 'female') return 'female'
    throw new Error(`Invalid sex: ${sex}`)
  }

  /**
   * Parse race selection
   */
  private parseRace(race: string): 'white' | 'african_american' | 'other' {
    if (race.includes('Non-Hispanic White')) return 'white'
    if (race.includes('African American')) return 'african_american'
    if (race.includes('Other')) return 'other'
    throw new Error(`Invalid race: ${race}`)
  }

  /**
   * Parse cholesterol range to midpoint value
   */
  private parseCholesterolRange(cholesterolRange: string): number {
    if (cholesterolRange.includes('Less than 160')) return 150
    if (cholesterolRange.includes('160-199')) return 180
    if (cholesterolRange.includes('200-239')) return 220
    if (cholesterolRange.includes('240-279')) return 260
    if (cholesterolRange.includes('280') && cholesterolRange.includes('higher')) return 300
    throw new Error(`Invalid cholesterol range: ${cholesterolRange}`)
  }

  /**
   * Parse HDL range to midpoint value
   */
  private parseHDLRange(hdlRange: string): number {
    if (hdlRange.includes('Less than 40')) return 35
    if (hdlRange.includes('40-49')) return 45
    if (hdlRange.includes('50-59')) return 55
    if (hdlRange.includes('60') && hdlRange.includes('higher')) return 65
    throw new Error(`Invalid HDL range: ${hdlRange}`)
  }

  /**
   * Parse blood pressure range to midpoint value
   */
  private parseBPRange(bpRange: string): number {
    if (bpRange.includes('Less than 120')) return 110
    if (bpRange.includes('120-129')) return 125
    if (bpRange.includes('130-139')) return 135
    if (bpRange.includes('140-159')) return 150
    if (bpRange.includes('160-179')) return 170
    if (bpRange.includes('180') && bpRange.includes('higher')) return 190
    throw new Error(`Invalid BP range: ${bpRange}`)
  }

  /**
   * Validate inputs are within acceptable ranges
   */
  private validateInputs(inputs: ASCVDInputs): void {
    if (inputs.age < 40 || inputs.age > 79) {
      throw new Error('Age must be between 40-79 years for validated results')
    }

    if (!['male', 'female'].includes(inputs.sex)) {
      throw new Error('Invalid sex value')
    }

    if (!['white', 'african_american', 'other'].includes(inputs.race)) {
      throw new Error('Invalid race value')
    }

    if (inputs.totalCholesterol < 130 || inputs.totalCholesterol > 320) {
      console.warn('Total cholesterol outside typical range (130-320 mg/dL)')
    }

    if (inputs.hdlCholesterol < 20 || inputs.hdlCholesterol > 100) {
      console.warn('HDL cholesterol outside typical range (20-100 mg/dL)')
    }

    if (inputs.systolicBP < 90 || inputs.systolicBP > 200) {
      console.warn('Systolic BP outside typical range (90-200 mmHg)')
    }
  }

  /**
   * Calculate ASCVD risk using Pooled Cohort Equations
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

    // Convert inputs to the format needed for equations
    const lnAge = Math.log(age)
    const lnTotalChol = Math.log(totalCholesterol)
    const lnHDL = Math.log(hdlCholesterol)
    const lnSysBP = Math.log(systolicBP)
    const diabetesFlag = diabetes ? 1 : 0
    const smokerFlag = smoker ? 1 : 0
    const bpMedsFlag = onBPMeds ? 1 : 0

    // Select appropriate equation based on sex and race
    if (sex === 'female' && race === 'white') {
      return this.calculateWhiteFemale(
        lnAge,
        lnTotalChol,
        lnHDL,
        lnSysBP,
        bpMedsFlag,
        diabetesFlag,
        smokerFlag,
      )
    } else if (sex === 'female' && race === 'african_american') {
      return this.calculateBlackFemale(
        lnAge,
        lnTotalChol,
        lnHDL,
        lnSysBP,
        bpMedsFlag,
        diabetesFlag,
        smokerFlag,
      )
    } else if (sex === 'male' && race === 'white') {
      return this.calculateWhiteMale(
        lnAge,
        lnTotalChol,
        lnHDL,
        lnSysBP,
        bpMedsFlag,
        diabetesFlag,
        smokerFlag,
      )
    } else if (sex === 'male' && race === 'african_american') {
      return this.calculateBlackMale(
        lnAge,
        lnTotalChol,
        lnHDL,
        lnSysBP,
        bpMedsFlag,
        diabetesFlag,
        smokerFlag,
      )
    } else {
      // For 'other' race, use white equations as default
      if (sex === 'female') {
        return this.calculateWhiteFemale(
          lnAge,
          lnTotalChol,
          lnHDL,
          lnSysBP,
          bpMedsFlag,
          diabetesFlag,
          smokerFlag,
        )
      } else {
        return this.calculateWhiteMale(
          lnAge,
          lnTotalChol,
          lnHDL,
          lnSysBP,
          bpMedsFlag,
          diabetesFlag,
          smokerFlag,
        )
      }
    }
  }

  /**
   * White Female Equation
   */
  private calculateWhiteFemale(
    lnAge: number,
    lnTotalChol: number,
    lnHDL: number,
    lnSysBP: number,
    bpMeds: number,
    diabetes: number,
    smoker: number,
  ): number {
    const coefficients = {
      lnAge: -29.799,
      lnAgeSquared: 4.884,
      lnTotalChol: 13.54,
      lnAgeXlnTotalChol: -3.114,
      lnHDL: -13.578,
      lnAgeXlnHDL: 3.149,
      lnTreatedSysBP: 2.019,
      lnAgeXlnTreatedSysBP: 0,
      lnUntreatedSysBP: 1.957,
      lnAgeXlnUntreatedSysBP: 0,
      smoker: 7.574,
      lnAgeXsmoker: -1.665,
      diabetes: 0.661,
    }

    const meanValues = {
      lnAge: 3.994,
      lnTotalChol: 5.273,
      lnHDL: 3.816,
      lnTreatedSysBP: 4.884,
      lnUntreatedSysBP: 4.962,
      smoker: 0.152,
      diabetes: 0.062,
    }

    const baselineSurvival = 0.9665

    let individualSum = 0
    let meanSum = 0

    // Calculate individual sum
    individualSum += coefficients.lnAge * lnAge
    individualSum += coefficients.lnAgeSquared * lnAge * lnAge
    individualSum += coefficients.lnTotalChol * lnTotalChol
    individualSum += coefficients.lnAgeXlnTotalChol * lnAge * lnTotalChol
    individualSum += coefficients.lnHDL * lnHDL
    individualSum += coefficients.lnAgeXlnHDL * lnAge * lnHDL

    if (bpMeds) {
      individualSum += coefficients.lnTreatedSysBP * lnSysBP
      individualSum += coefficients.lnAgeXlnTreatedSysBP * lnAge * lnSysBP
    } else {
      individualSum += coefficients.lnUntreatedSysBP * lnSysBP
      individualSum += coefficients.lnAgeXlnUntreatedSysBP * lnAge * lnSysBP
    }

    individualSum += coefficients.smoker * smoker
    individualSum += coefficients.lnAgeXsmoker * lnAge * smoker
    individualSum += coefficients.diabetes * diabetes

    // Calculate mean sum
    meanSum += coefficients.lnAge * meanValues.lnAge
    meanSum += coefficients.lnAgeSquared * meanValues.lnAge * meanValues.lnAge
    meanSum += coefficients.lnTotalChol * meanValues.lnTotalChol
    meanSum += coefficients.lnAgeXlnTotalChol * meanValues.lnAge * meanValues.lnTotalChol
    meanSum += coefficients.lnHDL * meanValues.lnHDL
    meanSum += coefficients.lnAgeXlnHDL * meanValues.lnAge * meanValues.lnHDL
    meanSum += coefficients.lnTreatedSysBP * meanValues.lnTreatedSysBP * 0.018 // fraction treated
    meanSum += coefficients.lnUntreatedSysBP * meanValues.lnUntreatedSysBP * 0.982 // fraction untreated
    meanSum += coefficients.smoker * meanValues.smoker
    meanSum += coefficients.lnAgeXsmoker * meanValues.lnAge * meanValues.smoker
    meanSum += coefficients.diabetes * meanValues.diabetes

    // Calculate 10-year risk
    const riskScore = 1 - Math.pow(baselineSurvival, Math.exp(individualSum - meanSum))
    return Math.max(0, Math.min(1, riskScore)) * 100 // Convert to percentage and bound 0-100%
  }

  /**
   * Black Female Equation
   */
  private calculateBlackFemale(
    lnAge: number,
    lnTotalChol: number,
    lnHDL: number,
    lnSysBP: number,
    bpMeds: number,
    diabetes: number,
    smoker: number,
  ): number {
    const coefficients = {
      lnAge: 17.114,
      lnTotalChol: 0.94,
      lnHDL: -18.92,
      lnAgeXlnHDL: 4.475,
      lnTreatedSysBP: 29.291,
      lnAgeXlnTreatedSysBP: -6.432,
      lnUntreatedSysBP: 27.82,
      lnAgeXlnUntreatedSysBP: -6.087,
      smoker: 0.691,
      diabetes: 0.874,
    }

    const meanValues = {
      lnAge: 3.563,
      lnTotalChol: 5.192,
      lnHDL: 3.909,
      lnTreatedSysBP: 4.975,
      lnUntreatedSysBP: 4.836,
      smoker: 0.284,
      diabetes: 0.228,
    }

    const baselineSurvival = 0.9533

    let individualSum = 0
    let meanSum = 0

    // Calculate individual sum
    individualSum += coefficients.lnAge * lnAge
    individualSum += coefficients.lnTotalChol * lnTotalChol
    individualSum += coefficients.lnHDL * lnHDL
    individualSum += coefficients.lnAgeXlnHDL * lnAge * lnHDL

    if (bpMeds) {
      individualSum += coefficients.lnTreatedSysBP * lnSysBP
      individualSum += coefficients.lnAgeXlnTreatedSysBP * lnAge * lnSysBP
    } else {
      individualSum += coefficients.lnUntreatedSysBP * lnSysBP
      individualSum += coefficients.lnAgeXlnUntreatedSysBP * lnAge * lnSysBP
    }

    individualSum += coefficients.smoker * smoker
    individualSum += coefficients.diabetes * diabetes

    // Calculate mean sum
    meanSum += coefficients.lnAge * meanValues.lnAge
    meanSum += coefficients.lnTotalChol * meanValues.lnTotalChol
    meanSum += coefficients.lnHDL * meanValues.lnHDL
    meanSum += coefficients.lnAgeXlnHDL * meanValues.lnAge * meanValues.lnHDL
    meanSum += coefficients.lnTreatedSysBP * meanValues.lnTreatedSysBP * 0.203
    meanSum += coefficients.lnUntreatedSysBP * meanValues.lnUntreatedSysBP * 0.797
    meanSum += coefficients.smoker * meanValues.smoker
    meanSum += coefficients.diabetes * meanValues.diabetes

    const riskScore = 1 - Math.pow(baselineSurvival, Math.exp(individualSum - meanSum))
    return Math.max(0, Math.min(1, riskScore)) * 100
  }

  /**
   * White Male Equation
   */
  private calculateWhiteMale(
    lnAge: number,
    lnTotalChol: number,
    lnHDL: number,
    lnSysBP: number,
    bpMeds: number,
    diabetes: number,
    smoker: number,
  ): number {
    const coefficients = {
      lnAge: 12.344,
      lnTotalChol: 11.853,
      lnAgeXlnTotalChol: -2.664,
      lnHDL: -7.99,
      lnAgeXlnHDL: 1.769,
      lnTreatedSysBP: 1.797,
      lnUntreatedSysBP: 1.764,
      smoker: 7.837,
      lnAgeXsmoker: -1.795,
      diabetes: 0.658,
    }

    const meanValues = {
      lnAge: 3.863,
      lnTotalChol: 5.365,
      lnHDL: 3.802,
      lnTreatedSysBP: 4.964,
      lnUntreatedSysBP: 4.809,
      smoker: 0.249,
      diabetes: 0.073,
    }

    const baselineSurvival = 0.9144

    let individualSum = 0
    let meanSum = 0

    // Calculate individual sum
    individualSum += coefficients.lnAge * lnAge
    individualSum += coefficients.lnTotalChol * lnTotalChol
    individualSum += coefficients.lnAgeXlnTotalChol * lnAge * lnTotalChol
    individualSum += coefficients.lnHDL * lnHDL
    individualSum += coefficients.lnAgeXlnHDL * lnAge * lnHDL

    if (bpMeds) {
      individualSum += coefficients.lnTreatedSysBP * lnSysBP
    } else {
      individualSum += coefficients.lnUntreatedSysBP * lnSysBP
    }

    individualSum += coefficients.smoker * smoker
    individualSum += coefficients.lnAgeXsmoker * lnAge * smoker
    individualSum += coefficients.diabetes * diabetes

    // Calculate mean sum
    meanSum += coefficients.lnAge * meanValues.lnAge
    meanSum += coefficients.lnTotalChol * meanValues.lnTotalChol
    meanSum += coefficients.lnAgeXlnTotalChol * meanValues.lnAge * meanValues.lnTotalChol
    meanSum += coefficients.lnHDL * meanValues.lnHDL
    meanSum += coefficients.lnAgeXlnHDL * meanValues.lnAge * meanValues.lnHDL
    meanSum += coefficients.lnTreatedSysBP * meanValues.lnTreatedSysBP * 0.058
    meanSum += coefficients.lnUntreatedSysBP * meanValues.lnUntreatedSysBP * 0.942
    meanSum += coefficients.smoker * meanValues.smoker
    meanSum += coefficients.lnAgeXsmoker * meanValues.lnAge * meanValues.smoker
    meanSum += coefficients.diabetes * meanValues.diabetes

    const riskScore = 1 - Math.pow(baselineSurvival, Math.exp(individualSum - meanSum))
    return Math.max(0, Math.min(1, riskScore)) * 100
  }

  /**
   * Black Male Equation
   */
  private calculateBlackMale(
    lnAge: number,
    lnTotalChol: number,
    lnHDL: number,
    lnSysBP: number,
    bpMeds: number,
    diabetes: number,
    smoker: number,
  ): number {
    const coefficients = {
      lnAge: 2.469,
      lnTotalChol: 0.302,
      lnHDL: -0.307,
      lnTreatedSysBP: 1.916,
      lnUntreatedSysBP: 1.809,
      smoker: 0.549,
      diabetes: 0.645,
    }

    const meanValues = {
      lnAge: 3.647,
      lnTotalChol: 5.271,
      lnHDL: 3.863,
      lnTreatedSysBP: 4.923,
      lnUntreatedSysBP: 4.738,
      smoker: 0.405,
      diabetes: 0.18,
    }

    const baselineSurvival = 0.8954

    let individualSum = 0
    let meanSum = 0

    // Calculate individual sum
    individualSum += coefficients.lnAge * lnAge
    individualSum += coefficients.lnTotalChol * lnTotalChol
    individualSum += coefficients.lnHDL * lnHDL

    if (bpMeds) {
      individualSum += coefficients.lnTreatedSysBP * lnSysBP
    } else {
      individualSum += coefficients.lnUntreatedSysBP * lnSysBP
    }

    individualSum += coefficients.smoker * smoker
    individualSum += coefficients.diabetes * diabetes

    // Calculate mean sum
    meanSum += coefficients.lnAge * meanValues.lnAge
    meanSum += coefficients.lnTotalChol * meanValues.lnTotalChol
    meanSum += coefficients.lnHDL * meanValues.lnHDL
    meanSum += coefficients.lnTreatedSysBP * meanValues.lnTreatedSysBP * 0.114
    meanSum += coefficients.lnUntreatedSysBP * meanValues.lnUntreatedSysBP * 0.886
    meanSum += coefficients.smoker * meanValues.smoker
    meanSum += coefficients.diabetes * meanValues.diabetes

    const riskScore = 1 - Math.pow(baselineSurvival, Math.exp(individualSum - meanSum))
    return Math.max(0, Math.min(1, riskScore)) * 100
  }

  /**
   * Get risk category based on percentage
   */
  private getRiskCategory(riskScore: number): any {
    for (const category of this.riskCategories) {
      if (riskScore >= category.range.min && riskScore <= category.range.max) {
        return category
      }
    }
    // Default to high risk if somehow outside ranges
    return this.riskCategories[this.riskCategories.length - 1]
  }

  /**
   * Get interpretation text based on risk and patient factors
   */
  private getInterpretation(riskScore: number, inputs: ASCVDInputs): string {
    const category = this.getRiskCategory(riskScore)

    let interpretation = `Based on the Pooled Cohort Equations, this ${inputs.age}-year-old ${inputs.sex} has a ${riskScore}% 10-year risk of atherosclerotic cardiovascular disease, which falls into the ${category.name.toLowerCase()} category.`

    // Add specific recommendations based on risk level
    if (riskScore < 5) {
      interpretation += ' Lifestyle modifications and regular monitoring are recommended.'
    } else if (riskScore < 7.5) {
      interpretation +=
        ' Consider lifestyle modifications and discuss statin therapy if additional risk factors are present.'
    } else if (riskScore < 20) {
      interpretation += ' Statin therapy should be considered along with lifestyle modifications.'
    } else {
      interpretation +=
        ' High-intensity statin therapy is recommended along with aggressive lifestyle modifications.'
    }

    return interpretation
  }
}
