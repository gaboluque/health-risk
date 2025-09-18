import React from 'react'
import { GAD7Form } from './components/GAD7Form'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import { QuestionnairePage } from '@/components/questionnaire'
import gad7Data from '@/lib/data/questionnaires/gad7.json'

export default function GAD7Page() {
  const questionnaire = loadQuestionnaire(gad7Data)

  return (
    <QuestionnairePage questionnaire={questionnaire}>
      <GAD7Form questionnaire={questionnaire} />
    </QuestionnairePage>
  )
}
