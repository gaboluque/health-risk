'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { QuestionnaireQuestion, QuestionnaireOption } from '@/lib/types/questionnaire'

interface QuestionCardProps {
  question: QuestionnaireQuestion
  questionIndex: number
  value: string
  options: QuestionnaireOption[]
  onChange: (value: string) => void
}

export function QuestionCard({
  question,
  questionIndex,
  value,
  options,
  onChange,
}: QuestionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-semibold text-slate-600">{questionIndex + 1}</span>
            </div>
            <div className="flex-1">
              <Label htmlFor={question.id} className="text-base font-semibold text-slate-700 block">
                {question.description || question.label}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(newValue) => {
            if (newValue) {
              onChange(newValue)
            }
          }}
          className="flex-col items-stretch gap-3 w-full"
          variant="outline"
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="justify-start text-left p-4 h-auto min-h-[3rem] whitespace-normal break-words transition-all duration-200 data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:text-blue-900 data-[state=on]:shadow-md hover:bg-slate-50 hover:border-slate-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative border-slate-200 rounded-lg"
            >
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 w-4 h-4 mr-3 rounded-full border-2 border-slate-300 transition-colors duration-200 flex items-center justify-center">
                  {value === option.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <span className="text-sm leading-relaxed font-medium text-slate-700">
                  {option.label}
                </span>
              </div>
              {value === option.value && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
