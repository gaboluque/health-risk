'use client'

import React, { useEffect, useState } from 'react'
import { ProgressIndicator } from './ProgressIndicator'

interface StickyProgressBarProps {
  completed: number
  total: number
  progressIndicatorId: string
}

export function StickyProgressBar({
  completed,
  total,
  progressIndicatorId,
}: StickyProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const progressIndicator = document.getElementById(progressIndicatorId)

      if (!progressIndicator) return

      const progressRect = progressIndicator.getBoundingClientRect()
      const shouldShow = progressRect.bottom <= 0

      setIsVisible(shouldShow)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [progressIndicatorId])

  return (
    <div
      className={`fixed top-[70px] left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ProgressIndicator completed={completed} total={total} />
      </div>
    </div>
  )
}
