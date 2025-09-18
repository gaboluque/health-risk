'use client'

import React from 'react'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { UserProfileForm } from './UserProfileForm'
import { Loader2 } from 'lucide-react'

interface ProfileGateProps {
  children: React.ReactNode
}

export function ProfileGate({ children }: ProfileGateProps) {
  const { isProfileComplete, setProfile, loadingProfile } = useUserProfile()

  if (loadingProfile) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!isProfileComplete) {
    return (
      <div className="flex flex-col min-h-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center my-6">
          Welcome! Please set up your profile to continue.
        </h2>
        <UserProfileForm onSubmit={setProfile} />
      </div>
    )
  }

  return <>{children}</>
}
