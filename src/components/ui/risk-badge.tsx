import React from 'react'
import { cn } from '@/lib/utils'
import { RiskResult } from '@/lib/types/questionnaire'
import { RISK_LEVEL_COLORS, RISK_LEVEL_MAPPING, RISK_VALUE_TO_NAME } from '@/lib/utils/risk-mapping'
import { hexToTailwindColor } from '@/lib/utils/questionnaires/questionnaire-registry'

interface RiskBadgeProps {
  riskLevel: RiskResult['riskLevel']
  className?: string
}

export function RiskBadge({ riskLevel, className }: RiskBadgeProps) {
  const colorConfig = RISK_LEVEL_COLORS[riskLevel]
  const config = {
    label: RISK_VALUE_TO_NAME[RISK_LEVEL_MAPPING[riskLevel]],
    bgColor: `bg-${hexToTailwindColor(colorConfig.bgColor)}`,
    textColor: `text-${hexToTailwindColor(colorConfig.textColor)}`,
    borderColor: `border-${hexToTailwindColor(colorConfig.borderColor)}`,
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
