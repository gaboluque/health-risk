import React from 'react'
import { Heart, Activity, Bone, Brain, Shield } from 'lucide-react'
import { QuestionnaireSchema } from '@/lib/types/questionnaire'

interface QuestionnairePageProps {
  questionnaire: QuestionnaireSchema
  children: React.ReactNode
}

const getQuestionnaireIcon = (category: string) => {
  switch (category) {
    case 'cardiovascular':
      return Heart
    case 'diabetes':
    case 'metabolic':
      return Activity
    case 'musculoskeletal':
      return Bone
    case 'mental_health':
      return Brain
    case 'pain_management':
      return Shield
    default:
      return Heart
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'cardiovascular':
      return {
        gradient: 'from-red-500 to-pink-600',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      }
    case 'diabetes':
    case 'metabolic':
      return {
        gradient: 'from-blue-500 to-cyan-600',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      }
    case 'musculoskeletal':
      return {
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      }
    case 'mental_health':
      return {
        gradient: 'from-purple-500 to-indigo-600',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
      }
    case 'pain_management':
      return {
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
      }
    default:
      return {
        gradient: 'from-slate-500 to-slate-600',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
      }
  }
}

export function QuestionnairePage({ questionnaire, children }: QuestionnairePageProps) {
  const IconComponent = getQuestionnaireIcon(questionnaire.category)
  const colors = getCategoryColor(questionnaire.category)

  return (
    <div className="flex flex-col min-h-full">
      <section className="mt-6">
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex space-x-4 items-center">
            <div
              className={`inline-flex p-2 rounded-2xl ${colors.bg} ${colors.border} border-2 mb-6`}
            >
              <IconComponent className={`h-6 w-6 ${colors.text}`} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {questionnaire.patientFriendlyName || questionnaire.name}
              </h1>

              <p className="text-sm text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                {questionnaire.patientFriendlyDescription || questionnaire.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {children}
    </div>
  )
}
