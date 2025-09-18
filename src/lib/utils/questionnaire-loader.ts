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

/**
 * Creates a basic questionnaire template
 * @param id - Unique identifier for the questionnaire
 * @param name - Display name
 * @param description - Description of what the questionnaire measures
 * @returns Basic QuestionnaireSchema template
 */
export function createQuestionnaireTemplate(
  id: string,
  name: string,
  description: string,
): Partial<QuestionnaireSchema> {
  return {
    id,
    name,
    description,
    version: '1.0.0',
    category: 'general',
    questions: [],
    scoring: {
      algorithm: 'custom',
      output: {
        type: 'percentage',
        label: 'Risk Score',
        unit: '%',
        precision: 1,
      },
      riskCategories: [
        {
          name: 'Low Risk',
          range: { min: 0, max: 25 },
          color: '#10b981',
          description: 'Low risk',
        },
        {
          name: 'Moderate Risk',
          range: { min: 26, max: 50 },
          color: '#f59e0b',
          description: 'Moderate risk',
        },
        {
          name: 'High Risk',
          range: { min: 51, max: 100 },
          color: '#ef4444',
          description: 'High risk',
        },
      ],
    },
    metadata: {
      createdAt: new Date().toISOString().split('T')[0],
      clinicalUse: 'Risk assessment',
    },
  }
}
