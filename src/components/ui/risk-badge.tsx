import React from 'react'
import { cn } from '@/lib/utils'

interface RiskBadgeProps {
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
  className?: string
}

const riskConfig = {
  minimal: {
    label: 'Riesgo Mínimo',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  low: {
    label: 'Riesgo Bajo',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  moderate: {
    label: 'Riesgo Moderado',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
  high: {
    label: 'Riesgo Alto',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  severe: {
    label: 'Riesgo Severo',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
}

export function RiskBadge({ riskLevel, className }: RiskBadgeProps) {
  const config = riskConfig[riskLevel]

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
