import type { QuestionnaireSchema } from '@/lib/types/questionnaire'
import { loadQuestionnaire } from './questionnaire-loader'

// Import all questionnaire JSON files
import ascvdData from '@/lib/data/questionnaires/ascvd.json'
import findriskData from '@/lib/data/questionnaires/findrisk.json'
import fraxData from '@/lib/data/questionnaires/frax.json'
import gad7Data from '@/lib/data/questionnaires/gad7.json'
import startData from '@/lib/data/questionnaires/start.json'

/**
 * Registry of all available questionnaires
 */
export const questionnaireRegistry = new Map<string, QuestionnaireSchema>([
  ['Calculadora de Riesgo ASCVD', loadQuestionnaire(ascvdData)],
  ['Calculadora de Riesgo de Diabetes FINDRISK', loadQuestionnaire(findriskData)],
  ['Evaluación de Riesgo de Fractura FRAX', loadQuestionnaire(fraxData)],
  ['Evaluación de Ansiedad GAD-7', loadQuestionnaire(gad7Data)],
  ['Herramienta STarT Back', loadQuestionnaire(startData)],
])

/**
 * Get a questionnaire schema by name
 * @param name - The name of the questionnaire
 * @returns The questionnaire schema or undefined if not found
 */
export function getQuestionnaireByName(name: string): QuestionnaireSchema | undefined {
  return questionnaireRegistry.get(name)
}

/**
 * Get the chart color for a questionnaire by name
 * @param name - The name of the questionnaire
 * @returns The chart color or a default gray color
 */
export function getQuestionnaireChartColor(name: string): string {
  const questionnaire = getQuestionnaireByName(name)
  return questionnaire?.chartColor || '#6b7280' // gray-500 as fallback
}

/**
 * Convert hex color to Tailwind CSS background class
 * @param hexColor - Hex color string
 * @returns Tailwind CSS background class
 */
function hexToTailwindBg(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#ef4444': 'bg-red-500',
    '#3b82f6': 'bg-blue-500',
    '#10b981': 'bg-green-500',
    '#8b5cf6': 'bg-purple-500',
    '#f59e0b': 'bg-orange-500',
    '#6b7280': 'bg-gray-500',
  }
  return colorMap[hexColor] || 'bg-gray-500'
}

/**
 * Get the Tailwind CSS background class for a questionnaire by name
 * @param name - The name of the questionnaire
 * @returns Tailwind CSS background class
 */
export function getQuestionnaireTailwindColor(name: string): string {
  const hexColor = getQuestionnaireChartColor(name)
  return hexToTailwindBg(hexColor)
}

/**
 * Get all questionnaire schemas
 * @returns Array of all questionnaire schemas
 */
export function getAllQuestionnaires(): QuestionnaireSchema[] {
  return Array.from(questionnaireRegistry.values())
}
