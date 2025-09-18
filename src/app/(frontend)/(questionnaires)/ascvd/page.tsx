import React from 'react'
import { ASCVDForm } from './components/ASCVDForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import { QuestionnairePage } from '@/components/questionnaire'
import ascvdData from '@/lib/data/questionnaires/ascvd.json'

export default function ASCVDPage() {
  const questionnaire = loadQuestionnaire(ascvdData)

  return (
    <QuestionnairePage questionnaire={questionnaire}>
      <ASCVDForm questionnaire={questionnaire} />
    </QuestionnairePage>
  )
}
