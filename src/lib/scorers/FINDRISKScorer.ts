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

    return {
      score: totalScore,
      risk,
      standardRiskLevel: this.mapToStandardRiskLevel(risk),
      riskDescription: this.getRiskDescription(totalScore),
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

    // The waist circumference options in FINDRISK already include sex-specific values
    switch (waist) {
      case 'male_under_94':
        return 0
      case 'male_94_102':
        return 3
      case 'male_over_102':
        return 4
      case 'female_under_80':
        return 0
      case 'female_80_88':
        return 3
      case 'female_over_88':
        return 4
      default:
        return 0
    }
  }

  private getPhysicalActivityScore(): number {
    const activity = this.getAnswerValue('physical_activity')

    switch (activity) {
      case 'yes':
        return 0
      case 'no':
        return 2
      default:
        return 0
    }
  }

  private getVegetableFruitScore(): number {
    const vegetables = this.getAnswerValue('vegetables_fruits')

    switch (vegetables) {
      case 'yes':
        return 0
      case 'no':
        return 1
      default:
        return 0
    }
  }

  private getBPMedicationScore(): number {
    const bpMeds = this.getAnswerValue('bp_medication')

    switch (bpMeds) {
      case 'no':
        return 0
      case 'yes':
        return 2
      default:
        return 0
    }
  }

  private getHighGlucoseScore(): number {
    const glucose = this.getAnswerValue('high_glucose_history')

    switch (glucose) {
      case 'no':
        return 0
      case 'yes':
        return 5
      default:
        return 0
    }
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

  private getRiskDescription(score: number): string {
    if (score < 7) {
      return '1 de cada 100 desarrollará diabetes tipo 2 en 10 años'
    } else if (score >= 7 && score <= 11) {
      return '1 de cada 25 desarrollará diabetes tipo 2 en 10 años'
    } else if (score >= 12 && score <= 14) {
      return '1 de cada 6 desarrollará diabetes tipo 2 en 10 años'
    } else if (score >= 15 && score <= 20) {
      return '1 de cada 3 desarrollará diabetes tipo 2 en 10 años'
    } else {
      return '1 de cada 2 desarrollará diabetes tipo 2 en 10 años'
    }
  }
}
