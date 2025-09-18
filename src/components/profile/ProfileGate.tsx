'use client'

import React from 'react'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { UserProfileForm } from './UserProfileForm'

interface ProfileGateProps {
  children: React.ReactNode
}

export function ProfileGate({ children }: ProfileGateProps) {
  const { isProfileComplete, setProfile } = useUserProfile()

  if (!isProfileComplete) {
    return <UserProfileForm onSubmit={setProfile} />
  }

  return <>{children}</>
}
