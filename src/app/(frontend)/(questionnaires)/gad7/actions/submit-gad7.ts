'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { GAD7Scorer } from '@/lib/scorers/GAD7Scorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'
import type { UserProfile } from '@/lib/types/user-profile'

export async function submitGAD7Questionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: GAD7Scorer,
  })
}
