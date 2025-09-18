'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { FRAXScorer } from '@/lib/scorers/FRAXScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'

export async function submitFRAXQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    scorerClass: FRAXScorer,
  })
}
