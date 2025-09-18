'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { STarTScorer } from '@/lib/scorers/STarTScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'

export async function submitSTarTQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    scorerClass: STarTScorer,
  })
}
