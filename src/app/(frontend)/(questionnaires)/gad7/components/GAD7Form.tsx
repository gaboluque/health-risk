'use client'

import React from 'react'
import { StandardQuestionnaireForm } from '@/components/questionnaire'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface GAD7FormProps {
  questionnaire: QuestionnaireSchema
}

/**
 * GAD-7 Form Component
 *
 * Renders the GAD-7 (Generalized Anxiety Disorder 7-item) assessment questionnaire.
 * Uses the standardized questionnaire form pattern for consistent behavior and UI.
 */
export function GAD7Form({ questionnaire }: GAD7FormProps) {
  return <StandardQuestionnaireForm questionnaire={questionnaire} />
}
