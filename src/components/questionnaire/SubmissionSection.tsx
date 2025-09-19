'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface SubmissionSectionProps {
  isSubmitting: boolean
  submitButtonText: string
  loadingText: string
}

export function SubmissionSection({
  isSubmitting,
  submitButtonText,
  loadingText,
}: SubmissionSectionProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-900">¿Listo para ver tus resultados?</h4>
          <p className="text-xs text-slate-600">
            Asegúrate de que todos los campos requeridos estén completos
          </p>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {loadingText}
            </div>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </div>
  )
}
