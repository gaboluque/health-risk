import type { UserProfile } from '@/lib/types/user-profile'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

/**
 * Maps a numeric age to the appropriate age range for a specific questionnaire
 */
function mapAgeToRange(age: number, questionnaire: QuestionnaireSchema): string | null {
  const ageQuestion = questionnaire.questions.find((q) => q.id === 'age')
  if (!ageQuestion?.options) return null

  // Find the appropriate age range based on the questionnaire's options
  for (const option of ageQuestion.options) {
    const value = option.value

    // Handle different age range formats
    if (value === 'under_40' && age < 40) return value
    if (value === 'under_45' && age < 45) return value
    if (value === '40-44' && age >= 40 && age <= 44) return value
    if (value === '45-49' && age >= 45 && age <= 49) return value
    if (value === '45_54' && age >= 45 && age <= 54) return value
    if (value === '50-54' && age >= 50 && age <= 54) return value
    if (value === '55-59' && age >= 55 && age <= 59) return value
    if (value === '55_64' && age >= 55 && age <= 64) return value
    if (value === '60-64' && age >= 60 && age <= 64) return value
    if (value === '65-69' && age >= 65 && age <= 69) return value
    if (value === '65_over' && age >= 65) return value
    if (value === '70-74' && age >= 70 && age <= 74) return value
    if (value === '75-79' && age >= 75 && age <= 79) return value
    if (value === '80-84' && age >= 80 && age <= 84) return value
    if (value === '85-90' && age >= 85 && age <= 90) return value
  }

  return null
}

/**
 * Maps a numeric BMI to the appropriate BMI range for a specific questionnaire
 */
function mapBMIToRange(bmi: number, questionnaire: QuestionnaireSchema): string | null {
  const bmiQuestion = questionnaire.questions.find((q) => q.id === 'bmi')
  if (!bmiQuestion?.options) return null

  // Find the appropriate BMI range based on the questionnaire's options
  for (const option of bmiQuestion.options) {
    const value = option.value

    // Handle different BMI range formats
    if (value === 'under_19' && bmi < 19) return value
    if (value === 'under_25' && bmi < 25) return value
    if (value === '19-25' && bmi >= 19 && bmi < 25) return value
    if (value === '25-30' && bmi >= 25 && bmi < 30) return value
    if (value === '25_30' && bmi >= 25 && bmi < 30) return value
    if (value === '30-35' && bmi >= 30 && bmi < 35) return value
    if (value === 'over_30' && bmi >= 30) return value
    if (value === 'over_35' && bmi >= 35) return value
  }

  return null
}

/**
 * Maps user profile data to questionnaire answers where possible
 */
export function mapProfileToAnswers(
  profile: UserProfile,
  questionnaire: QuestionnaireSchema,
): Record<string, string> {
  const answers: Record<string, string> = {}

  for (const question of questionnaire.questions) {
    // Map age - convert numeric age to appropriate range
    if (question.id === 'age' && profile.age) {
      const ageRange = mapAgeToRange(profile.age, questionnaire)
      if (ageRange) {
        answers[question.id] = ageRange
      }
      continue
    }

    // Map sex/gender
    if (question.id === 'sex' && profile.sex) {
      answers[question.id] = profile.sex
      continue
    }

    // Map BMI - convert numeric BMI to appropriate range
    if (question.id === 'bmi' && profile.bmi) {
      const bmiRange = mapBMIToRange(profile.bmi, questionnaire)
      if (bmiRange) {
        answers[question.id] = bmiRange
      }
      continue
    }

    // Map current smoking status
    if (question.id === 'current_smoking' && profile.currentSmoking !== undefined) {
      answers[question.id] = profile.currentSmoking ? 'yes' : 'no'
      continue
    }
  }

  return answers
}

/**
 * Gets questions that should be hidden because they can be answered from profile
 */
export function getProfileAnsweredQuestions(
  profile: UserProfile,
  questionnaire: QuestionnaireSchema,
): Set<string> {
  const answeredQuestions = new Set<string>()

  for (const question of questionnaire.questions) {
    // Hide age question if profile has age and can be mapped to a range
    if (question.id === 'age' && profile.age) {
      const ageRange = mapAgeToRange(profile.age, questionnaire)
      if (ageRange) {
        answeredQuestions.add(question.id)
      }
    }

    // Hide sex question if profile has sex
    if (question.id === 'sex' && profile.sex) {
      answeredQuestions.add(question.id)
    }

    // Hide BMI question if profile has BMI and can be mapped to a range
    if (question.id === 'bmi' && profile.bmi) {
      const bmiRange = mapBMIToRange(profile.bmi, questionnaire)
      if (bmiRange) {
        answeredQuestions.add(question.id)
      }
    }

    // Hide current smoking question if profile has smoking status
    if (question.id === 'current_smoking' && profile.currentSmoking !== undefined) {
      answeredQuestions.add(question.id)
    }
  }

  return answeredQuestions
}
