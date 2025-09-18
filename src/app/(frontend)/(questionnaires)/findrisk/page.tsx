import React from 'react'
import { FINDRISKForm } from './components/FINDRISKForm'
import { loadQuestionnaire } from '@/lib/utils/questionnaire-loader'
import { QuestionnairePage } from '@/components/questionnaire'
import findriskData from '@/lib/data/questionnaires/findrisk.json'

export default function FINDRISKPage() {
  const questionnaire = loadQuestionnaire(findriskData)

  return (
    <QuestionnairePage questionnaire={questionnaire}>
      <FINDRISKForm questionnaire={questionnaire} />
    </QuestionnairePage>
  )
}
