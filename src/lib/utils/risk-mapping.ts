import { RiskResult, RiskLevel } from '@/lib/types/questionnaire'

export const RISK_LEVEL_MAPPING = {
  [RiskLevel.UNKNOWN]: 0,
  [RiskLevel.MINIMAL]: 1,
  [RiskLevel.LOW]: 2,
  [RiskLevel.MODERATE]: 3,
  [RiskLevel.HIGH]: 4,
  [RiskLevel.SEVERE]: 5,
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
  [RiskLevel.UNKNOWN]: {
    bgColor: 'gray-50',
    textColor: 'gray-700',
    borderColor: 'gray-300',
  },
  [RiskLevel.MINIMAL]: {
    bgColor: 'emerald-50',
    textColor: 'emerald-700',
    borderColor: 'emerald-200',
  },
  [RiskLevel.LOW]: {
    bgColor: 'green-50',
    textColor: 'green-700',
    borderColor: 'green-200',
  },
  [RiskLevel.MODERATE]: {
    bgColor: 'amber-50',
    textColor: 'amber-700',
    borderColor: 'amber-200',
  },
  [RiskLevel.HIGH]: {
    bgColor: 'orange-50',
    textColor: 'orange-700',
    borderColor: 'orange-200',
  },
  [RiskLevel.SEVERE]: {
    bgColor: 'red-50',
    textColor: 'red-700',
    borderColor: 'red-200',
  },
} as const

export function riskLevelToNumber(riskLevel: RiskLevel): number {
  return RISK_LEVEL_MAPPING[riskLevel] || 1
}

export function riskNumberToName(value: number): string {
  return RISK_VALUE_TO_NAME[value as keyof typeof RISK_VALUE_TO_NAME] || RISK_VALUE_TO_NAME[0]
}

export function getRiskValueColor(riskLevel: RiskLevel): string {
  return `bg-${RISK_LEVEL_COLORS[riskLevel].bgColor || RISK_LEVEL_COLORS[RiskLevel.UNKNOWN].bgColor}`
}

export function calculateAverageRisk(riskLevels: RiskResult['riskValue'][]): number {
  if (riskLevels.length === 0) return 0

  const sum = riskLevels.reduce((acc, level) => acc + level, 0)
  return sum / riskLevels.length
}
