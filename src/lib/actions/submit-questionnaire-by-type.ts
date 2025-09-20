'use server'

import { submitQuestionnaire } from '@/lib/actions/submit-questionnaire'
import { Questionnaires } from '@/lib/utils/questionnaires/questionnaire-registry'
import type { FormData, QuestionnaireSchema, SubmissionResponse } from '@/lib/types/questionnaire'
import type { UserProfile } from '@/lib/types/user-profile'

/**
 * Submit a questionnaire using the appropriate scorer based on questionnaire type
 * @param questionnaire - The questionnaire schema
 * @param formData - The form data to submit
 * @param userProfile - The user's profile
 * @returns Promise resolving to submission response
 */
export async function submitQuestionnaireByType(
  questionnaire: QuestionnaireSchema,
  formData: FormData,
  userProfile: UserProfile,
): Promise<SubmissionResponse> {
  // Get the appropriate scorer class for this questionnaire
  const ScorerClass = Questionnaires[questionnaire.name].scorer

  if (!ScorerClass) {
    return {
      success: false,
      error: `No scorer found for questionnaire type: ${questionnaire.id}`,
    }
  }

  // Use the existing submitQuestionnaire function with the dynamically selected scorer
  return submitQuestionnaire({
    questionnaire,
    formData,
    userProfile,
    scorerClass: ScorerClass,
  })
}
