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
import { BaseScorer } from '@/lib/scorers/BaseScorer'

export const Questionnaires: Record<
  string,
  { name: string; data: QuestionnaireSchema; scorer: typeof BaseScorer }
> = {
  ascvd: {
    name: 'ascvd',
    data: ascvdData,
    scorer: ASCVDScorer,
  },
  findrisk: {
    name: 'findrisk',
    data: findriskData,
    scorer: FINDRISKScorer,
  },
  frax: {
    name: 'frax',
    data: fraxData,
    scorer: FRAXScorer,
  },
  gad7: {
    name: 'gad7',
    data: gad7Data,
    scorer: GAD7Scorer,
  },
  start: {
    name: 'start',
    data: startData,
    scorer: STarTScorer,
  },
}

export function getQuestionnaireDataByName(name: string): QuestionnaireSchema {
  return loadQuestionnaire(Questionnaires[name.toLowerCase()].data)
}

export function getQuestionnaireChartColor(name: string): string {
  const questionnaire = getQuestionnaireDataByName(name)
  return questionnaire?.chartColor || '#6b7280' // gray-500 as fallback
}

/**
 * Convert hex color to Tailwind CSS background class
 * @param hexColor - Hex color string
 * @returns Tailwind CSS background class
 */
export function hexToTailwindColor(hexColor: string): string {
  const colorMap: Record<string, string> = {
    // Red colors
    '#ef4444': 'red-500',
    '#dc2626': 'red-600',
    '#991b1b': 'red-800',

    // Orange colors
    '#ea580c': 'orange-600',

    // Amber/Yellow colors
    '#f59e0b': 'amber-500',
    '#d97706': 'amber-600',

    // Green/Emerald colors (using emerald for #10b981 as it's more accurate)
    '#10b981': 'emerald-500',
    '#059669': 'emerald-600',
    '#047857': 'emerald-700',
    '#15803d': 'green-700',

    // Blue colors
    '#3b82f6': 'blue-500',
    '#2563eb': 'blue-600',
    '#1d4ed8': 'blue-700',

    // Purple colors
    '#8b5cf6': 'purple-500',
    '#7c3aed': 'purple-600',
    '#6d28d9': 'purple-700',

    // Gray colors
    '#6b7280': 'gray-500',
    '#4b5563': 'gray-600',
    '#374151': 'gray-700',
    '#1f2937': 'gray-800',

    // Teal colors
    '#14b8a6': 'teal-500',
    '#0d9488': 'teal-600',

    // Indigo colors
    '#6366f1': 'indigo-500',
    '#4f46e5': 'indigo-600',

    // Pink colors
    '#ec4899': 'pink-500',
    '#db2777': 'pink-600',

    // Cyan colors
    '#06b6d4': 'cyan-500',
    '#0891b2': 'cyan-600',

    // Additional colors from risk mapping
    '#a16207': 'yellow-700',
    '#c2410c': 'orange-700',

    // White colors
    '#ffffff': 'white',
  }
  return colorMap[hexColor] || 'gray-500'
}

export function getQuestionnaireTailwindColor(name: string): string {
  const hexColor = getQuestionnaireChartColor(name)
  return `bg-${hexToTailwindColor(hexColor)}`
}

export function getAvailableQuestionnaireNames(): string[] {
  return Array.from(Object.keys(Questionnaires))
}

/**
 * Type for questionnaire display data
 */
export interface QuestionnaireDisplayData {
  id: string
  title: string
  description: string
  icon: string
  category: string
  color: string
  bgColor: string
  textColor: string
}

export function getQuestionnairesForDisplay(): QuestionnaireDisplayData[] {
  return getAvailableQuestionnaireNames()
    .map((name) => {
      const questionnaire = getQuestionnaireDataByName(name)
      if (!questionnaire) return null

      return {
        id: questionnaire.id,
        title: questionnaire.patientFriendlyName || questionnaire.name,
        description: questionnaire.patientFriendlyDescription || questionnaire.description,
        icon: questionnaire.icon || 'Activity',
        category: questionnaire.displayCategory || questionnaire.category,
        color: questionnaire.color || 'from-gray-500 to-gray-600',
        bgColor: questionnaire.bgColor || 'bg-gray-50',
        textColor: questionnaire.textColor || 'text-gray-700',
      }
    })
    .filter((item): item is QuestionnaireDisplayData => item !== null)
}
