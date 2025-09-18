import React from 'react'
import { Stethoscope } from 'lucide-react'

interface FooterProps {
  variant?: 'simple' | 'detailed'
}

export function Footer({ variant = 'simple' }: FooterProps) {
  if (variant === 'detailed') {
    return (
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Auditare Health</span>
          </div>
          <p className="text-sm">&copy; 2025 Auditare Health. All rights reserved.</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="text-center text-sm">
        <p>&copy; 2025 Auditare Health. All rights reserved.</p>
      </div>
    </footer>
  )
}
