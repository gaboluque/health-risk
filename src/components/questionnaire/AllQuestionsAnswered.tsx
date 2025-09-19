'use client'

import React from 'react'

export function AllQuestionsAnswered() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center">
        <div className="p-2 bg-green-100 rounded-lg mr-3">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-900">All Questions Answered!</h3>
          <p className="text-sm text-green-700">
            Your profile information has answered all the questions for this assessment. You can
            submit directly.
          </p>
        </div>
      </div>
    </div>
  )
}
