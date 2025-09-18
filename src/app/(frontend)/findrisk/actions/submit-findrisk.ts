'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { FINDRISKScorer } from '@/lib/scorers/FINDRISKScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'

export async function submitFINDRISKQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    scorerClass: FINDRISKScorer,
  })
}
