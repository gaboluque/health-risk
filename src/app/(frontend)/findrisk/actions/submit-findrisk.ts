'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { FINDRISKScorer } from '@/lib/scorers/FINDRISKScorer'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'
import type { UserProfile } from '@/lib/types/user-profile'

export async function submitFINDRISKQuestionnaire(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: FINDRISKScorer,
  })
}
