import { BaseScorer } from './BaseScorer'
import type { QuestionnaireSubmission } from '@/payload-types'
import type { FormData } from '@/lib/types/questionnaire'
import { RiskLevel, type RiskResult } from '@/lib/types/questionnaire'

/**
 * Harvard Cancer Risk Index (HCRI) Scorer
 * Based on the validated methodology developed by Graham Colditz and colleagues
 *
 * This implementation follows the approach described in:
 * "Harvard Report on Cancer Prevention Volume 4: Harvard Cancer Risk Index"
 * Cancer Causes Control. 2000;11:477-488.
 *
 * The HCRI calculates relative risk compared to population average for same age/sex,
 * using a point-based system with risk factors weighted by strength of evidence.
 *
 * Validation: Discriminatory accuracy 0.67-0.72 for specific cancers
 * (Nurses' Health Study & Health Professionals' Follow-up Study)
 */
export class HCRIScorer extends BaseScorer {
  // Age and sex-specific baseline risks (from SEER data, per 100,000)
  private readonly baselineRisks = {
    male: {
      under_40: 80,
      '40-49': 150,
      '50-59': 350,
      '60-69': 750,
      '70-79': 1200,
      '80_plus': 1600,
    },
    female: {
      under_40: 100,
      '40-49': 180,
      '50-59': 400,
      '60-69': 650,
      '70-79': 1000,
      '80_plus': 1300,
    },
  }

  // Population average risk scores by age and sex (for relative risk calculation)
  private readonly populationAverageScores = {
    male: {
      under_40: 85,
      '40-49': 100,
      '50-59': 110,
      '60-69': 120,
      '70-79': 125,
      '80_plus': 130,
    },
    female: {
      under_40: 80,
      '40-49': 95,
      '50-59': 105,
      '60-69': 115,
      '70-79': 120,
      '80_plus': 125,
    },
  }

  constructor(questionnaireSubmission: QuestionnaireSubmission, formData: FormData) {
    super(questionnaireSubmission, formData)
  }

  calculateRisk(): RiskResult {
    const age = this.getAnswerValue('age') as keyof typeof this.baselineRisks.male
    const sex = this.getAnswerValue('sex') as 'male' | 'female'

    // Calculate individual risk score using point system
    const individualRiskScore = this.calculateIndividualRiskScore()

    // Get population average risk score for same age/sex
    const populationAverageScore = this.populationAverageScores[sex][age]

    // Calculate relative risk ratio
    const relativeRisk = individualRiskScore / populationAverageScore

    // Determine risk category based on relative risk
    const riskLevel = this.interpretRelativeRisk(relativeRisk)

    return {
      score: Math.round(relativeRisk * 100) / 100, // Round to 2 decimal places
      riskLevel: riskLevel,
      riskValue: this.getRiskValue(riskLevel),
      riskDescription: this.getRiskDescription(riskLevel),
    }
  }

  /**
   * Calculate individual risk score using Harvard Cancer Risk Index methodology
   * Points are allocated based on strength of evidence and magnitude of association
   */
  private calculateIndividualRiskScore(): number {
    let totalPoints = 0

    // Demographics and non-modifiable factors
    totalPoints += this.calculateDemographicPoints()
    totalPoints += this.calculateGeneticPoints()

    // Lifestyle factors (strongest evidence)
    totalPoints += this.calculateSmokingPoints()
    totalPoints += this.calculateAlcoholPoints()
    totalPoints += this.calculateDietPoints()
    totalPoints += this.calculatePhysicalActivityPoints()
    totalPoints += this.calculateBodyWeightPoints()

    // Environmental and occupational factors
    totalPoints += this.calculateEnvironmentalPoints()

    // Reproductive factors (women only)
    if (this.getAnswerValue('sex') === 'female') {
      totalPoints += this.calculateReproductivePoints()
      totalPoints += this.calculateHormonePoints()
    }

    // Protective factors (screening, supplements)
    totalPoints += this.calculateProtectivePoints()

    return Math.max(50, totalPoints) // Minimum score of 50
  }

  /**
   * Demographic and race/ethnicity points
   */
  private calculateDemographicPoints(): number {
    const age = this.getAnswerValue('age')
    const sex = this.getAnswerValue('sex')
    const race = this.getAnswerValue('race_ethnicity')

    let points = 0

    // Base age points (older age = higher risk)
    switch (age) {
      case 'under_40':
        points += 75
        break
      case '40-49':
        points += 90
        break
      case '50-59':
        points += 100
        break
      case '60-69':
        points += 110
        break
      case '70-79':
        points += 115
        break
      case '80_plus':
        points += 120
        break
    }

    // Race/ethnicity adjustments based on epidemiological data
    const raceAdjustments = {
      white: 0,
      black: sex === 'male' ? 5 : -2, // Higher risk for some cancers in men, lower in women
      hispanic: -3, // Generally lower cancer rates
      asian: -8, // Lower rates for many cancers
      native_american: 3, // Higher rates for certain cancers
      other: 0,
    }

    points += raceAdjustments[race as keyof typeof raceAdjustments] || 0

    return points
  }

  /**
   * Family history and genetic factors
   */
  private calculateGeneticPoints(): number {
    const familyHistory = this.getAnswerValue('family_history_cancer')

    switch (familyHistory) {
      case 'none':
        return -5 // Slightly protective
      case 'one_relative':
        return 8 // Moderate increase
      case 'multiple_relatives':
        return 18 // Strong family history
      case 'hereditary_cancer':
        return 35 // Known hereditary syndromes
      default:
        return 0
    }
  }

  /**
   * Smoking-related points (strongest single risk factor)
   */
  private calculateSmokingPoints(): number {
    const smoking = this.getAnswerValue('smoking_status')

    switch (smoking) {
      case 'never':
        return -8 // Protective
      case 'former_light':
        return 5 // Some residual risk
      case 'former_recent':
        return 12 // Higher residual risk
      case 'current_light':
        return 25 // Significant risk
      case 'current_heavy':
        return 45 // Very high risk
      default:
        return 0
    }
  }

  /**
   * Alcohol consumption points
   */
  private calculateAlcoholPoints(): number {
    const alcohol = this.getAnswerValue('alcohol_consumption')

    switch (alcohol) {
      case 'none':
        return -3 // Slightly protective
      case 'light':
        return 0 // Neutral
      case 'moderate':
        return 8 // Moderate risk increase
      case 'heavy':
        return 20 // Significant risk increase
      default:
        return 0
    }
  }

  /**
   * Diet-related points
   */
  private calculateDietPoints(): number {
    let dietPoints = 0

    // Fruits and vegetables (protective)
    const fruitsVeggies = this.getAnswerValue('diet_fruits_vegetables')
    switch (fruitsVeggies) {
      case 'low':
        dietPoints += 8
        break
      case 'moderate':
        dietPoints += 0
        break
      case 'high':
        dietPoints -= 6
        break
    }

    // Red meat consumption (risk factor)
    const redMeat = this.getAnswerValue('red_meat_consumption')
    switch (redMeat) {
      case 'rare':
        dietPoints -= 3
        break
      case 'occasional':
        dietPoints += 0
        break
      case 'moderate':
        dietPoints += 5
        break
      case 'frequent':
        dietPoints += 12
        break
    }

    return dietPoints
  }

  /**
   * Physical activity points (protective)
   */
  private calculatePhysicalActivityPoints(): number {
    const activity = this.getAnswerValue('physical_activity')

    switch (activity) {
      case 'none':
        return 12 // Sedentary lifestyle increases risk
      case 'occasional':
        return 5 // Some benefit
      case 'regular':
        return -5 // Protective
      case 'frequent':
        return -10 // More protective
      default:
        return 0
    }
  }

  /**
   * Body weight/BMI points
   */
  private calculateBodyWeightPoints(): number {
    const bmi = this.getAnswerValue('bmi')

    switch (bmi) {
      case 'under_19':
        return 3 // Slightly increased risk (underweight)
      case '19-25':
        return -3 // Protective (normal weight)
      case '25-30':
        return 5 // Moderate risk increase (overweight)
      case 'over_30':
        return 15 // Significant risk increase (obese)
      default:
        return 0
    }
  }

  /**
   * Environmental and occupational exposure points
   */
  private calculateEnvironmentalPoints(): number {
    let envPoints = 0

    // Sun exposure (primarily skin cancer risk)
    const sunExposure = this.getAnswerValue('sun_exposure')
    switch (sunExposure) {
      case 'minimal':
        envPoints += 0
        break
      case 'moderate':
        envPoints += 0
        break
      case 'high_protected':
        envPoints += 2
        break
      case 'high_unprotected':
        envPoints += 8
        break
    }

    // Occupational exposures
    const occupational = this.getAnswerValue('occupational_exposures')
    switch (occupational) {
      case 'none':
        envPoints += 0
        break
      case 'possible':
        envPoints += 5
        break
      case 'confirmed':
        envPoints += 15
        break
      case 'radiation':
        envPoints += 20
        break
    }

    return envPoints
  }

  /**
   * Reproductive factors (women only)
   */
  private calculateReproductivePoints(): number {
    const reproductiveHistory = this.getAnswerValue('reproductive_history')

    if (!reproductiveHistory) return 0

    switch (reproductiveHistory) {
      case 'not_applicable':
        return 0
      case 'nulliparous':
        return 5 // Never having children increases some cancer risks
      case 'late_first_birth':
        return 3 // Late first pregnancy
      case 'early_first_birth':
        return -3 // Protective for some cancers
      case 'multiple_births':
        return -5 // Multiple pregnancies protective
      case 'breastfeeding':
        return -8 // Breastfeeding protective
      default:
        return 0
    }
  }

  /**
   * Hormone use points (women only)
   */
  private calculateHormonePoints(): number {
    const hormoneUse = this.getAnswerValue('hormone_use')

    if (!hormoneUse) return 0

    switch (hormoneUse) {
      case 'not_applicable':
        return 0
      case 'never':
        return 0 // Baseline
      case 'oral_contraceptives':
        return 2 // Slight increase for some cancers
      case 'hrt_current':
        return 12 // Current HRT increases breast cancer risk
      case 'hrt_past':
        return 6 // Some residual risk from past HRT
      case 'both':
        return 8 // Combined use
      default:
        return 0
    }
  }

  /**
   * Protective factors points (screening, supplements)
   */
  private calculateProtectivePoints(): number {
    let protectivePoints = 0

    // Vitamin supplementation (protective)
    const vitamins = this.getAnswerValue('vitamin_supplement')
    switch (vitamins) {
      case 'not_applicable':
        protectivePoints += 0
        break
      case 'none':
        protectivePoints += 3
        break // Slight risk increase
      case 'multivitamin':
        protectivePoints -= 5
        break // Protective
      case 'specific':
        protectivePoints -= 4
        break // Some protection
      case 'multiple':
        protectivePoints -= 7
        break // More protection
    }

    // Screening compliance (early detection benefit)
    const screening = this.getAnswerValue('screening_compliance')
    switch (screening) {
      case 'not_applicable':
        protectivePoints += 0
        break
      case 'fully_compliant':
        protectivePoints -= 8
        break // Significant benefit
      case 'mostly_compliant':
        protectivePoints -= 5
        break // Some benefit
      case 'partially_compliant':
        protectivePoints -= 2
        break // Limited benefit
      case 'non_compliant':
        protectivePoints += 5
        break // Missed opportunities
    }

    return protectivePoints
  }

  /**
   * Interpret relative risk score into categorical risk level
   * Based on HCRI methodology with 5-level scale matching questionnaire categories
   * Maps to RiskLevel enum for consistency with other questionnaires
   */
  private interpretRelativeRisk(relativeRisk: number): RiskResult['riskLevel'] {
    if (relativeRisk < 0.5) {
      return RiskLevel.MINIMAL // "Muy Por Debajo del Promedio"
    } else if (relativeRisk < 0.8) {
      return RiskLevel.LOW // "Por Debajo del Promedio"
    } else if (relativeRisk < 1.25) {
      return RiskLevel.MODERATE // "Promedio"
    } else if (relativeRisk < 2.0) {
      return RiskLevel.HIGH // "Por Encima del Promedio"
    } else {
      return RiskLevel.SEVERE // "Muy Por Encima del Promedio"
    }
  }
}
