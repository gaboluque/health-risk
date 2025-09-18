import Link from 'next/link'
import React from 'react'
import { Heart, Activity, Bone, Brain, Shield, ArrowRight } from 'lucide-react'
import { ProfileGate } from '@/components/profile/ProfileGate'

import './styles.css'

const healthAssessments = [
  {
    id: 'ascvd',
    title: 'Heart Health Check',
    description: 'Assess your 10-year risk of heart disease and stroke',
    icon: Heart,
    category: 'Cardiovascular',
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  {
    id: 'findrisk',
    title: 'Diabetes Risk Check',
    description: 'Evaluate your risk of developing Type 2 diabetes',
    icon: Activity,
    category: 'Metabolic',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    id: 'frax',
    title: 'Bone Health Check',
    description: 'Calculate your risk of osteoporotic fractures',
    icon: Bone,
    category: 'Musculoskeletal',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  {
    id: 'gad7',
    title: 'Anxiety Assessment',
    description: 'Screen for generalized anxiety disorder symptoms',
    icon: Brain,
    category: 'Mental Health',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    id: 'start',
    title: 'Back Pain Assessment',
    description: 'Evaluate your back pain and treatment options',
    icon: Shield,
    category: 'Pain Management',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
]

export default async function HomePage() {
  return (
    <ProfileGate>
      <div className="flex flex-col min-h-full">
        {/* Content wrapper */}

        {/* Health Assessments Grid */}
        <section className="pb-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthAssessments.map((assessment) => {
                const IconComponent = assessment.icon
                return (
                  <Link key={assessment.id} href={`/${assessment.id}`} className="group">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${assessment.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${assessment.textColor}`} />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                            {assessment.title}
                          </h3>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{assessment.description}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${assessment.bgColor} ${assessment.textColor}`}
                        >
                          {assessment.category}
                        </span>
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
