'use client'

import React from 'react'
import Link from 'next/link'
import { Stethoscope } from 'lucide-react'
import { ProfileMenu } from '@/components/profile/ProfileMenu'

interface ClientHeaderProps {
  user?: {
    email: string
  } | null
  showBackToHome?: boolean
}

export function ClientHeader({ user, showBackToHome = false }: ClientHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`flex items-center space-x-3 transition-colors ${
                showBackToHome ? 'text-slate-600 hover:text-slate-900' : 'text-slate-900'
              }`}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                <Stethoscope className={`${showBackToHome ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
              </div>
              <div>
                <h1 className={`${showBackToHome ? 'text-lg' : 'text-xl'} font-bold`}>
                  Auditare Health
                </h1>
              </div>
            </Link>
          </div>
          <ProfileMenu />
          {user && !showBackToHome && (
            <div className="text-right ml-4">
              <p className="text-sm text-slate-600">Admin</p>
              <p className="font-medium text-slate-900">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
