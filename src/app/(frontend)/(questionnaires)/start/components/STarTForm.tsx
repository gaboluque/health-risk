'use client'

import React from 'react'
import { StandardQuestionnaireForm } from '@/components/questionnaire'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface STarTFormProps {
  questionnaire: QuestionnaireSchema
}

/**
 * STarT Back Form Component
 *
 * Renders the STarT Back screening tool for back pain assessment.
 * Uses the standardized questionnaire form pattern for consistent behavior and UI.
 */
export function STarTForm({ questionnaire }: STarTFormProps) {
  return <StandardQuestionnaireForm questionnaire={questionnaire} />
}
