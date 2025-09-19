'use client'

import React from 'react'

interface ProgressIndicatorProps {
  completed: number
  total: number
  className?: string
}

export function ProgressIndicator({ completed, total, className = '' }: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 100

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <svg
            className="w-4 h-4 text-blue-600"
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
          <span className="text-sm font-semibold text-slate-900">
            {completed} of {total} completed
          </span>
        </div>
      </div>
      <div className="flex-1 mx-6">
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-sm font-bold text-blue-600">{percentage}%</div>
    </div>
  )
}
