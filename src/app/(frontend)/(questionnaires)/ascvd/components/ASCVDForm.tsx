'use client'

import React from 'react'
import { StandardQuestionnaireForm } from '@/components/questionnaire'
import type { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface ASCVDFormProps {
  questionnaire: QuestionnaireSchema
}

/**
 * ASCVD Form Component
 *
 * Renders the ASCVD (Atherosclerotic Cardiovascular Disease) risk assessment questionnaire.
 * Uses the standardized questionnaire form pattern for consistent behavior and UI.
 */
export function ASCVDForm({ questionnaire }: ASCVDFormProps) {
  return <StandardQuestionnaireForm questionnaire={questionnaire} />
}
