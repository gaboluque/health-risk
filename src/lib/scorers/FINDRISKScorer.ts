import { BaseScorer } from './BaseScorer'
import type { RiskResult } from '@/lib/types/questionnaire'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'

/**
 * FINDRISK (Finnish Diabetes Risk Score) Scorer
 * Calculates 10-year risk of developing Type 2 diabetes
 * Based on the Finnish Diabetes Risk Score algorithm
 */
export class FINDRISKScorer extends BaseScorer {
  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }
  calculateRisk(): RiskResult {
    let totalScore = 0

    // Question 1: Age
    totalScore += this.getAgeScore()

    // Question 2: BMI
    totalScore += this.getBMIScore()

    // Question 3: Waist Circumference
    totalScore += this.getWaistScore()

    // Question 4: Physical Activity
    totalScore += this.getPhysicalActivityScore()

    // Question 5: Daily Vegetables/Fruits
    totalScore += this.getVegetableFruitScore()

    // Question 6: Blood Pressure Medication
    totalScore += this.getBPMedicationScore()

    // Question 7: History of High Glucose
    totalScore += this.getHighGlucoseScore()

    // Question 8: Family History of Diabetes
    totalScore += this.getFamilyHistoryScore()

    const risk = this.interpretFINDRISK(totalScore)
    const interpretation = this.getInterpretation(totalScore, risk)

    return {
      score: totalScore,
      risk,
      interpretation,
    }
  }

  private getAgeScore(): number {
    const age = this.getAnswerValue('age')

    switch (age) {
      case 'under_45':
        return 0
      case '45_54':
        return 2
      case '55_64':
        return 3
      case '65_over':
        return 4
      default:
        return 0
    }
  }

  private getBMIScore(): number {
    const bmi = this.getAnswerValue('bmi')

    switch (bmi) {
      case 'under_25':
        return 0
      case '25_30':
        return 1
      case 'over_30':
        return 3
      default:
        return 0
    }
  }

  private getWaistScore(): number {
    const waist = this.getAnswerValue('waist_circumference')

    switch (waist) {
      case 'male_under_94':
      case 'female_under_80':
        return 0
      case 'male_94_102':
      case 'female_80_88':
        return 3
      case 'male_over_102':
      case 'female_over_88':
        return 4
      default:
        return 0
    }
  }

  private getPhysicalActivityScore(): number {
    const activity = this.getAnswerValue('physical_activity')
    return activity === 'yes' ? 0 : 2
  }

  private getVegetableFruitScore(): number {
    const vegetables = this.getAnswerValue('vegetables_fruits')
    return vegetables === 'yes' ? 0 : 1
  }

  private getBPMedicationScore(): number {
    const bpMed = this.getAnswerValue('bp_medication')
    return bpMed === 'yes' ? 2 : 0
  }

  private getHighGlucoseScore(): number {
    const highGlucose = this.getAnswerValue('high_glucose_history')
    return highGlucose === 'yes' ? 5 : 0
  }

  private getFamilyHistoryScore(): number {
    const familyHistory = this.getAnswerValue('family_diabetes_history')

    switch (familyHistory) {
      case 'no':
        return 0
      case 'grandparent_relative':
        return 3
      case 'parent_sibling_child':
        return 5
      default:
        return 0
    }
  }

  private interpretFINDRISK(score: number): string {
    if (score < 7) {
      return 'Low Risk'
    } else if (score >= 7 && score <= 11) {
      return 'Slightly Elevated Risk'
    } else if (score >= 12 && score <= 14) {
      return 'Moderate Risk'
    } else if (score >= 15 && score <= 20) {
      return 'High Risk'
    } else {
      return 'Very High Risk'
    }
  }

  private getTenYearRiskPercentage(score: number): string {
    if (score < 7) {
      return '1'
    } else if (score >= 7 && score <= 11) {
      return '4'
    } else if (score >= 12 && score <= 14) {
      return '17'
    } else if (score >= 15 && score <= 20) {
      return '33'
    } else {
      return '50'
    }
  }

  private getInterpretation(score: number, risk: string): string {
    const riskPercentage = this.getTenYearRiskPercentage(score)

    let interpretation = `Your FINDRISK score is ${score} out of 26 points, indicating ${risk.toLowerCase()}. `
    interpretation += `This corresponds to approximately a ${riskPercentage}% chance of developing Type 2 diabetes within the next 10 years. `

    // Add specific recommendations based on risk level
    if (score < 7) {
      interpretation +=
        'Continue maintaining your healthy lifestyle with regular physical activity and a balanced diet. '
      interpretation +=
        'Re-assess your diabetes risk every 3-5 years or if your health status changes significantly.'
    } else if (score >= 7 && score <= 11) {
      interpretation += 'Consider making lifestyle modifications to reduce your risk. '
      interpretation +=
        'Focus on increasing physical activity to at least 150 minutes per week, maintaining a healthy diet rich in vegetables and fruits, '
      interpretation +=
        'and monitoring your weight. Consider annual diabetes screening with your healthcare provider.'
    } else if (score >= 12 && score <= 14) {
      interpretation += 'It is important to implement lifestyle changes to prevent diabetes. '
      interpretation +=
        'Consider a structured weight management program if overweight, engage in regular physical activity (at least 150 minutes of moderate exercise per week), '
      interpretation += 'and seek dietary counseling. Annual glucose testing is recommended.'
    } else if (score >= 15 && score <= 20) {
      interpretation += 'You have a high risk and should prioritize diabetes prevention measures. '
      interpretation +=
        'Consider enrolling in a structured diabetes prevention program, aim for 5-10% weight reduction if overweight, '
      interpretation +=
        'engage in regular moderate physical activity, and work with a healthcare professional for dietary modification. '
      interpretation +=
        'Your doctor may consider preventive medication like metformin. Glucose testing every 6-12 months is recommended.'
    } else {
      interpretation +=
        'You have a very high risk and should seek immediate medical attention for diabetes prevention. '
      interpretation +=
        'Enroll in an intensive diabetes prevention program, implement significant lifestyle modifications, '
      interpretation +=
        'and discuss pharmacological intervention (such as metformin) with your healthcare provider. '
      interpretation +=
        'Regular monitoring and glucose testing every 3-6 months is strongly recommended.'
    }

    return interpretation
  }

  /**
   * Get detailed breakdown of scoring for educational purposes
   */
  public getScoreBreakdown(): Record<string, { score: number; description: string }> {
    return {
      age: {
        score: this.getAgeScore(),
        description: this.getAgeDescription(),
      },
      bmi: {
        score: this.getBMIScore(),
        description: this.getBMIDescription(),
      },
      waistCircumference: {
        score: this.getWaistScore(),
        description: this.getWaistDescription(),
      },
      physicalActivity: {
        score: this.getPhysicalActivityScore(),
        description: this.getPhysicalActivityDescription(),
      },
      vegetablesFruits: {
        score: this.getVegetableFruitScore(),
        description: this.getVegetableFruitDescription(),
      },
      bpMedication: {
        score: this.getBPMedicationScore(),
        description: this.getBPMedicationDescription(),
      },
      highGlucose: {
        score: this.getHighGlucoseScore(),
        description: this.getHighGlucoseDescription(),
      },
      familyHistory: {
        score: this.getFamilyHistoryScore(),
        description: this.getFamilyHistoryDescription(),
      },
    }
  }

  private getAgeDescription(): string {
    const age = this.getAnswerValue('age')
    switch (age) {
      case 'under_45':
        return 'Under 45 years (0 points)'
      case '45_54':
        return '45-54 years (2 points)'
      case '55_64':
        return '55-64 years (3 points)'
      case '65_over':
        return '65 years or over (4 points)'
      default:
        return 'Unknown age'
    }
  }

  private getBMIDescription(): string {
    const bmi = this.getAnswerValue('bmi')
    switch (bmi) {
      case 'under_25':
        return 'Normal weight - BMI under 25 (0 points)'
      case '25_30':
        return 'Overweight - BMI 25-30 (1 point)'
      case 'over_30':
        return 'Obese - BMI over 30 (3 points)'
      default:
        return 'Unknown BMI'
    }
  }

  private getWaistDescription(): string {
    const waist = this.getAnswerValue('waist_circumference')
    switch (waist) {
      case 'male_under_94':
        return 'Male: Normal waist - under 94 cm (0 points)'
      case 'male_94_102':
        return 'Male: Elevated waist - 94-102 cm (3 points)'
      case 'male_over_102':
        return 'Male: High waist - over 102 cm (4 points)'
      case 'female_under_80':
        return 'Female: Normal waist - under 80 cm (0 points)'
      case 'female_80_88':
        return 'Female: Elevated waist - 80-88 cm (3 points)'
      case 'female_over_88':
        return 'Female: High waist - over 88 cm (4 points)'
      default:
        return 'Unknown waist circumference'
    }
  }

  private getPhysicalActivityDescription(): string {
    const activity = this.getAnswerValue('physical_activity')
    return activity === 'yes'
      ? 'Active - at least 30 minutes daily (0 points)'
      : 'Inactive - less than 30 minutes daily (2 points)'
  }

  private getVegetableFruitDescription(): string {
    const vegetables = this.getAnswerValue('vegetables_fruits')
    return vegetables === 'yes'
      ? 'Eats vegetables/fruits daily (0 points)'
      : 'Does not eat vegetables/fruits daily (1 point)'
  }

  private getBPMedicationDescription(): string {
    const bpMed = this.getAnswerValue('bp_medication')
    return bpMed === 'yes'
      ? 'Takes blood pressure medication (2 points)'
      : 'No blood pressure medication (0 points)'
  }

  private getHighGlucoseDescription(): string {
    const highGlucose = this.getAnswerValue('high_glucose_history')
    return highGlucose === 'yes'
      ? 'History of high blood glucose (5 points)'
      : 'No history of high blood glucose (0 points)'
  }

  private getFamilyHistoryDescription(): string {
    const familyHistory = this.getAnswerValue('family_diabetes_history')
    switch (familyHistory) {
      case 'no':
        return 'No family history of diabetes (0 points)'
      case 'grandparent_relative':
        return 'Diabetes in grandparent/relative (3 points)'
      case 'parent_sibling_child':
        return 'Diabetes in parent/sibling/child (5 points)'
      default:
        return 'Unknown family history'
    }
  }
}
