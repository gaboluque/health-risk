'use client'

import React from 'react'
import { StandardQuestionnaireForm } from '@/components/questionnaire'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface FRAXFormProps {
  questionnaire: QuestionnaireSchema
}

/**
 * FRAX Form Component
 *
 * Renders the FRAX fracture risk assessment questionnaire.
 * Uses the standardized questionnaire form pattern for consistent behavior and UI.
 */
export function FRAXForm({ questionnaire }: FRAXFormProps) {
  return <StandardQuestionnaireForm questionnaire={questionnaire} />
}
