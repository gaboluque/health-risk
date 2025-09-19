import React from 'react'
import { notFound } from 'next/navigation'
import { QuestionnairePage, StandardQuestionnaireForm } from '@/components/questionnaire'
import {
  getQuestionnaireById,
  getAvailableQuestionnaireIds,
} from '@/lib/utils/questionnaire-registry'

interface QuestionnairePageProps {
  params: Promise<{
    questionnaireId: string
  }>
}

/**
 * Dynamic questionnaire page that handles all questionnaire types
 * Supports URLs like /ascvd, /findrisk, /frax, /gad7, /start
 */
export default async function QuestionnaireDynamicPage({ params }: QuestionnairePageProps) {
  const { questionnaireId } = await params

  // Load the questionnaire data by ID
  const questionnaire = getQuestionnaireById(questionnaireId)

  // If questionnaire not found, show 404
  if (!questionnaire) {
    notFound()
  }

  return (
    <QuestionnairePage questionnaire={questionnaire}>
      <StandardQuestionnaireForm questionnaire={questionnaire} />
    </QuestionnairePage>
  )
}

/**
 * Generate static params for all available questionnaires
 * This enables static generation for all questionnaire pages
 */
export function generateStaticParams() {
  const questionnaireIds = getAvailableQuestionnaireIds()

  return questionnaireIds.map((questionnaireId) => ({
    questionnaireId,
  }))
}

/**
 * Generate metadata for each questionnaire page
 */
export async function generateMetadata({ params }: QuestionnairePageProps) {
  const { questionnaireId } = await params
  const questionnaire = getQuestionnaireById(questionnaireId)

  if (!questionnaire) {
    return {
      title: 'Cuestionario no encontrado',
      description: 'El cuestionario solicitado no existe.',
    }
  }

  return {
    title: questionnaire.patientFriendlyName || questionnaire.name,
    description: questionnaire.patientFriendlyDescription || questionnaire.description,
  }
}
