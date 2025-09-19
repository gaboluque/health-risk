import type { QuestionnaireSchema } from '@/lib/types/questionnaire'
import { loadQuestionnaire } from './questionnaire-loader'

// Import all questionnaire JSON files
import ascvdData from '@/lib/data/questionnaires/ascvd.json'
import findriskData from '@/lib/data/questionnaires/findrisk.json'
import fraxData from '@/lib/data/questionnaires/frax.json'
import gad7Data from '@/lib/data/questionnaires/gad7.json'
import startData from '@/lib/data/questionnaires/start.json'

// Import all scorer classes
import { ASCVDScorer } from '@/lib/scorers/ASCVDScorer'
import { FINDRISKScorer } from '@/lib/scorers/FINDRISKScorer'
import { FRAXScorer } from '@/lib/scorers/FRAXScorer'
import { GAD7Scorer } from '@/lib/scorers/GAD7Scorer'
import { STarTScorer } from '@/lib/scorers/STarTScorer'

// Type for scorer constructor
type ScorerConstructor =
  | typeof ASCVDScorer
  | typeof FINDRISKScorer
  | typeof FRAXScorer
  | typeof GAD7Scorer
  | typeof STarTScorer

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
 * Registry mapping questionnaire IDs to their corresponding scorer classes
 */
export const scorerRegistry = new Map<string, ScorerConstructor>([
  ['ascvd', ASCVDScorer],
  ['findrisk', FINDRISKScorer],
  ['frax', FRAXScorer],
  ['gad7', GAD7Scorer],
  ['start', STarTScorer],
])

/**
 * Registry mapping questionnaire IDs to their data
 */
const questionnaireDataRegistry = new Map<string, QuestionnaireSchema>([
  ['ascvd', loadQuestionnaire(ascvdData)],
  ['findrisk', loadQuestionnaire(findriskData)],
  ['frax', loadQuestionnaire(fraxData)],
  ['gad7', loadQuestionnaire(gad7Data)],
  ['start', loadQuestionnaire(startData)],
])

/**
 * Get a questionnaire schema by ID
 * @param id - The ID of the questionnaire (e.g., 'ascvd', 'findrisk')
 * @returns The questionnaire schema or undefined if not found
 */
export function getQuestionnaireById(id: string): QuestionnaireSchema | undefined {
  return questionnaireDataRegistry.get(id.toLowerCase())
}

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

/**
 * Get a scorer class by questionnaire ID
 * @param questionnaireId - The ID of the questionnaire
 * @returns The scorer class or undefined if not found
 */
export function getScorerByQuestionnaireId(questionnaireId: string): ScorerConstructor | undefined {
  return scorerRegistry.get(questionnaireId.toLowerCase())
}

/**
 * Check if a questionnaire ID has a registered scorer
 * @param questionnaireId - The ID of the questionnaire
 * @returns True if the questionnaire has a registered scorer
 */
export function hasScorer(questionnaireId: string): boolean {
  return scorerRegistry.has(questionnaireId.toLowerCase())
}

/**
 * Get all available questionnaire IDs that have scorers
 * @returns Array of questionnaire IDs
 */
export function getAvailableQuestionnaireIds(): string[] {
  return Array.from(scorerRegistry.keys())
}
