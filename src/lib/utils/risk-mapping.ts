import { StandardRiskLevel } from '@/lib/types/questionnaire'

/**
 * Maps standardized risk levels to numerical values for trend analysis
 * Higher numbers represent higher risk levels
 */
export const RISK_LEVEL_MAPPING = {
  [StandardRiskLevel.MINIMAL]: 1,
  [StandardRiskLevel.LOW]: 2,
  [StandardRiskLevel.MODERATE]: 3,
  [StandardRiskLevel.HIGH]: 4,
  [StandardRiskLevel.SEVERE]: 5,
} as const

/**
 * Maps numerical risk values back to risk level names for display
 */
export const RISK_VALUE_TO_NAME = {
  1: 'Mínimo',
  2: 'Bajo',
  3: 'Moderado',
  4: 'Alto',
  5: 'Severo',
} as const

/**
 * Maps risk levels to colors for consistent visualization
 */
export const RISK_LEVEL_COLORS = {
  [StandardRiskLevel.MINIMAL]: '#10b981', // green-500
  [StandardRiskLevel.LOW]: '#3b82f6', // blue-500
  [StandardRiskLevel.MODERATE]: '#f59e0b', // amber-500
  [StandardRiskLevel.HIGH]: '#ef4444', // red-500
  [StandardRiskLevel.SEVERE]: '#991b1b', // red-800
} as const

/**
 * Convert a risk level to its numerical value
 * @param riskLevel - The standardized risk level
 * @returns The numerical value (1-5)
 */
export function riskLevelToNumber(riskLevel: StandardRiskLevel): number {
  return RISK_LEVEL_MAPPING[riskLevel] || 1
}

/**
 * Convert a numerical value back to a risk level name
 * @param value - The numerical value (1-5)
 * @returns The risk level name in Spanish
 */
export function riskNumberToName(value: number): string {
  return RISK_VALUE_TO_NAME[value as keyof typeof RISK_VALUE_TO_NAME] || 'Desconocido'
}

/**
 * Get the color for a risk level
 * @param riskLevel - The standardized risk level
 * @returns The hex color code
 */
export function getRiskLevelColor(riskLevel: StandardRiskLevel): string {
  return RISK_LEVEL_COLORS[riskLevel] || '#6b7280' // gray-500 as fallback
}

/**
 * Calculate the average risk value for a set of submissions
 * @param riskLevels - Array of standardized risk levels
 * @returns The average numerical risk value
 */
export function calculateAverageRisk(riskLevels: StandardRiskLevel[]): number {
  if (riskLevels.length === 0) return 0

  const sum = riskLevels.reduce((acc, level) => acc + riskLevelToNumber(level), 0)
  return sum / riskLevels.length
}
