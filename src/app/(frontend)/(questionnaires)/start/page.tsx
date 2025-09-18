import React from 'react'
import { STarTForm } from './components/STarTForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import { QuestionnairePage } from '@/components/questionnaire'
import startData from '@/lib/data/questionnaires/start.json'

export default function STarTPage() {
  const questionnaire = loadQuestionnaire(startData)

  return (
    <QuestionnairePage questionnaire={questionnaire}>
      <STarTForm questionnaire={questionnaire} />
    </QuestionnairePage>
  )
}
