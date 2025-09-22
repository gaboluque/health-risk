'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Heart, Activity, Bone, Brain, Shield, ArrowRight } from 'lucide-react'
import { ProfileGate } from '@/components/profile/ProfileGate'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { getUserSubmissions, type UserSubmissionSummary } from '@/lib/actions/get-user-submissions'
import { RiskBadge } from '@/components/ui/risk-badge'
import { getQuestionnairesForDisplay } from '@/lib/utils/questionnaires/questionnaire-registry'

import './styles.css'
import { RiskLevel } from '@/lib/types/questionnaire'

// Icon mapping for questionnaire icons
const iconMap = {
  Heart,
  Activity,
  Bone,
  Brain,
  Shield,
}

export default function HomePage() {
  const { profile, isProfileComplete } = useUserProfile()
  const [submissions, setSubmissions] = useState<UserSubmissionSummary[]>([])
  const [_loadingSubmissions, setLoadingSubmissions] = useState(false)

  // Get questionnaires from registry
  const healthAssessments = getQuestionnairesForDisplay()

  // Fetch submissions when profile is available
  useEffect(() => {
    if (profile && isProfileComplete) {
      setLoadingSubmissions(true)
      getUserSubmissions(profile)
        .then(setSubmissions)
        .catch((error) => {
          console.error('Error fetching submissions:', error)
          setSubmissions([])
        })
        .finally(() => setLoadingSubmissions(false))
    }
  }, [profile, isProfileComplete])

  // Helper function to get submission data for a specific assessment
  const getSubmissionForAssessment = (assessmentId: string) => {
    return submissions.find(
      (sub) =>
        sub.questionnaireId === assessmentId ||
        sub.questionnaireName.toLowerCase().includes(assessmentId.toLowerCase()),
    )
  }

  return (
    <ProfileGate>
      <div className="flex flex-col min-h-full">
        {/* Content wrapper */}

        {/* Health Assessments Grid */}
        <section className="pb-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthAssessments.map((assessment) => {
                const IconComponent = iconMap[assessment.icon as keyof typeof iconMap] || Activity
                const submission = getSubmissionForAssessment(assessment.id)
                const hasSubmission = submission?.lastSubmission

                if (hasSubmission) {
                  console.log({ submission, hasSubmission, assessment })
                }

                return (
                  <Link key={assessment.id} href={`/${assessment.id}`} className="group">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${assessment.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${assessment.textColor}`} />
                        </div>
                        {hasSubmission && (
                          <RiskBadge
                            riskLevel={submission.lastSubmission!.riskLevel as RiskLevel}
                            className="ml-2"
                          />
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                            {assessment.title}
                          </h3>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <p className="text-sm text-slate-600 mb-3 h-14">{assessment.description}</p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${assessment.bgColor} ${assessment.textColor}`}
                          >
                            {assessment.category}
                          </span>
                          {hasSubmission && (
                            <span className="text-xs text-slate-500">
                              Última evaluación:{' '}
                              {new Date(submission.lastSubmission!.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`w-full h-1 bg-gradient-to-r ${assessment.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </ProfileGate>
  )
}
