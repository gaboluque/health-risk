import React from 'react'
import { notFound } from 'next/navigation'
import { QuestionnairePage, StandardQuestionnaireForm } from '@/components/questionnaire'
import {
  getQuestionnaireDataByName,
  getAvailableQuestionnaireNames,
} from '@/lib/utils/questionnaires/questionnaire-registry'

interface QuestionnairePageProps {
  params: Promise<{
    questionnaireName: string
  }>
}

export function generateStaticParams() {
  const questionnaireNames = getAvailableQuestionnaireNames()

  return questionnaireNames.map((questionnaireName) => ({
    questionnaireName,
  }))
}

export default async function QuestionnaireFormPage({ params }: QuestionnairePageProps) {
  const { questionnaireName } = await params

  // Load the questionnaire data by ID
  const questionnaire = getQuestionnaireDataByName(questionnaireName)

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
