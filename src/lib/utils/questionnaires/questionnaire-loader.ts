import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

/**
 * Loads and validates a questionnaire schema from JSON data
 * @param data - Raw JSON data to convert to QuestionnaireSchema
 * @returns Validated QuestionnaireSchema object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadQuestionnaire(data: any): QuestionnaireSchema {
  // Basic validation
  if (!data.id || !data.name || !data.questions || !Array.isArray(data.questions)) {
    throw new Error('Invalid questionnaire data: missing required fields')
  }

  if (
    !data.scoring ||
    !data.scoring.riskCategories ||
    !Array.isArray(data.scoring.riskCategories)
  ) {
    throw new Error('Invalid questionnaire data: missing scoring configuration')
  }

  // Validate questions
  for (const question of data.questions) {
    if (!question.id || !question.label || !question.options || !Array.isArray(question.options)) {
      throw new Error(`Invalid question data: ${question.id || 'unknown question'}`)
    }
  }

  return data as QuestionnaireSchema
}
