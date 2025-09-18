'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { STarTScorer } from '@/lib/scorers/STarTScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'
import type { UserProfile } from '@/lib/types/user-profile'

export async function submitSTarTQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: STarTScorer,
  })
}
