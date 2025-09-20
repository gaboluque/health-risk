import { RiskCategory, RiskResult, StandardRiskLevel } from '@/lib/types/questionnaire'

export const RISK_LEVEL_MAPPING = {
  [StandardRiskLevel.UNKNOWN]: 0,
  [StandardRiskLevel.MINIMAL]: 1,
  [StandardRiskLevel.LOW]: 2,
  [StandardRiskLevel.MODERATE]: 3,
  [StandardRiskLevel.HIGH]: 4,
  [StandardRiskLevel.SEVERE]: 5,
} as const

export const RISK_VALUE_TO_NAME = {
  0: 'Desconocido',
  1: 'Mínimo',
  2: 'Bajo',
  3: 'Moderado',
  4: 'Alto',
  5: 'Severo',
} as const

export const RISK_LEVEL_COLORS = {
  [StandardRiskLevel.UNKNOWN]: {
    bgColor: '#6b7280',
    textColor: '#374151',
    borderColor: '#d1d5db',
  }, // gray-500, gray-700, gray-300
  [StandardRiskLevel.MINIMAL]: {
    bgColor: '#10b981',
    textColor: '#047857',
    borderColor: '#a7f3d0',
  }, // emerald-500, emerald-700, emerald-200
  [StandardRiskLevel.LOW]: {
    bgColor: '#3b82f6',
    textColor: '#15803d',
    borderColor: '#bbf7d0',
  }, // blue-500, green-700, green-200
  [StandardRiskLevel.MODERATE]: {
    bgColor: '#f59e0b',
    textColor: '#a16207',
    borderColor: '#fef3c7',
  }, // amber-500, yellow-700, yellow-200
  [StandardRiskLevel.HIGH]: {
    bgColor: '#ef4444',
    textColor: '#c2410c',
    borderColor: '#fed7aa',
  }, // red-500, orange-700, orange-200
  [StandardRiskLevel.SEVERE]: {
    bgColor: '#991b1b',
    textColor: '#dc2626',
    borderColor: '#fecaca',
  }, // red-800, red-600, red-200
} as const

export function riskLevelToNumber(riskLevel: StandardRiskLevel): number {
  return RISK_LEVEL_MAPPING[riskLevel] || 1
}

export function riskNumberToName(value: number): string {
  return RISK_VALUE_TO_NAME[value as keyof typeof RISK_VALUE_TO_NAME] || RISK_VALUE_TO_NAME[0]
}

export function getRiskValueColor(riskLevel: StandardRiskLevel): string {
  return `bg-${RISK_LEVEL_COLORS[riskLevel].bgColor || RISK_LEVEL_COLORS[StandardRiskLevel.UNKNOWN].bgColor}`
}

export function calculateAverageRisk(riskLevels: RiskResult['riskValue'][]): number {
  if (riskLevels.length === 0) return 0

  const sum = riskLevels.reduce((acc, level) => acc + level, 0)
  return sum / riskLevels.length
}
