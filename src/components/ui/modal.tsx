'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '2xl',
  showCloseButton = true,
}: ModalProps) {
  // Handle escape key press and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }

  return (
    <div
      className="modal h-full w-full fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in-0 duration-200"
      onClick={handleBackdropClick}
      style={{ height: '100vh', width: '100vw' }}
    >
      <div
        className={`bg-white rounded-xl ${maxWidthClasses[maxWidth]} w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200`}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2"
                title="Close modal (Esc)"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">{children}</div>
      </div>
    </div>
  )
}
