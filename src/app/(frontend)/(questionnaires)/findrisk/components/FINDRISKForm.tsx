'use client'

import React from 'react'
import { StandardQuestionnaireForm } from '@/components/questionnaire'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface FINDRISKFormProps {
  questionnaire: QuestionnaireSchema
}

/**
 * FINDRISK Form Component
 *
 * Renders the FINDRISK diabetes risk assessment questionnaire.
 * Uses the standardized questionnaire form pattern for consistent behavior and UI.
 */
export function FINDRISKForm({ questionnaire }: FINDRISKFormProps) {
  return <StandardQuestionnaireForm questionnaire={questionnaire} />
}
