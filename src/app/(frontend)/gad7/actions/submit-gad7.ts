'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { GAD7Scorer } from '@/lib/scorers/GAD7Scorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'

export async function submitGAD7Questionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    scorerClass: GAD7Scorer,
  })
}
