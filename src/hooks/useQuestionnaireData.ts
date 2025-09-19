import { useMemo } from 'react'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { mapProfileToAnswers, getProfileAnsweredQuestions } from '@/lib/utils/profile-mapping'
import type {
  QuestionnaireSchema,
  QuestionnaireQuestion,
  QuestionnaireOption,
} from '@/lib/types/questionnaire'

interface UseQuestionnaireDataReturn {
  displayedQuestions: QuestionnaireQuestion[]
  profileAnsweredQuestions: Set<string>
  getFilteredOptions: (question: QuestionnaireQuestion) => QuestionnaireOption[]
  getInitialAnswers: () => Record<string, string>
}

export function useQuestionnaireData(
  questionnaire: QuestionnaireSchema,
): UseQuestionnaireDataReturn {
  const { profile } = useUserProfile()

  // Get questions that are answered by profile
  const profileAnsweredQuestions = useMemo(() => {
    return profile ? getProfileAnsweredQuestions(profile, questionnaire) : new Set<string>()
  }, [profile, questionnaire])

  // Filter out questions that are answered by profile
  const displayedQuestions = useMemo(() => {
    return questionnaire.questions.filter((question) => !profileAnsweredQuestions.has(question.id))
  }, [questionnaire.questions, profileAnsweredQuestions])

  // Filter question options based on profile data (e.g., sex-specific options)
  const getFilteredOptions = useMemo(() => {
    return (question: QuestionnaireQuestion): QuestionnaireOption[] => {
      // Filter waist circumference options based on user's sex
      if (question.id === 'waist_circumference' && profile?.sex) {
        const userSex = profile.sex.toLowerCase()
        return question.options.filter((option: QuestionnaireOption) => {
          const optionValue = option.value.toLowerCase()
          // Show only options that match the user's sex
          if (userSex === 'male') {
            return optionValue.startsWith('male_')
          } else if (userSex === 'female') {
            return optionValue.startsWith('female_')
          }
          // If sex is not male/female, show all options
          return true
        })
      }

      // Return all options for other questions
      return question.options
    }
  }, [profile?.sex])

  // Get initial answers from profile
  const getInitialAnswers = useMemo(() => {
    return () => (profile ? mapProfileToAnswers(profile, questionnaire) : {})
  }, [profile, questionnaire])

  return {
    displayedQuestions,
    profileAnsweredQuestions,
    getFilteredOptions,
    getInitialAnswers,
  }
}
