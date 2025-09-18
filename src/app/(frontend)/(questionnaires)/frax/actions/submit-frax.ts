'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { FRAXScorer } from '@/lib/scorers/FRAXScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'
import type { UserProfile } from '@/lib/types/user-profile'

export async function submitFRAXQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: FRAXScorer,
  })
}
