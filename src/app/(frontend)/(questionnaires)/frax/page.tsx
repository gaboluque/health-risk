import React from 'react'
import { FRAXForm } from './components/FRAXForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import { QuestionnairePage } from '@/components/questionnaire'
import fraxData from '@/lib/data/questionnaires/frax.json'

export default function FRAXPage() {
  const questionnaire = loadQuestionnaire(fraxData)

  return (
    <QuestionnairePage questionnaire={questionnaire}>
      <FRAXForm questionnaire={questionnaire} />
    </QuestionnairePage>
  )
}
