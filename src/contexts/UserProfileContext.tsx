'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { enrichProfileWithCalculations } from '@/lib/utils/health-calculations'
import type { UserProfile, UserProfileContextType } from '@/lib/types/user-profile'

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userProfile')
    if (stored) {
      try {
        const parsedProfile = JSON.parse(stored)
        // Re-calculate age and BMI in case they've changed since last storage
        const enrichedProfile = enrichProfileWithCalculations(parsedProfile)
        setProfileState(enrichedProfile)
        setLoadingProfile(false)
      } catch (error) {
        console.error('Error parsing stored profile:', error)
        localStorage.removeItem('userProfile')
        setLoadingProfile(false)
      }
    }
    setLoadingProfile(false)
  }, [])

  const setProfile = (newProfile: UserProfile) => {
    const profileWithTimestamp = {
      ...newProfile,
      createdAt: new Date().toISOString(),
    }
    // Ensure calculated values are up to date
    const enrichedProfile = enrichProfileWithCalculations(profileWithTimestamp)
    setProfileState(enrichedProfile)
    localStorage.setItem('userProfile', JSON.stringify(enrichedProfile))
    setLoadingProfile(false)
  }

  const clearProfile = () => {
    setProfileState(null)
    localStorage.removeItem('userProfile')
    setLoadingProfile(false)
  }

  const isProfileComplete =
    profile !== null &&
    profile.firstName.trim() !== '' &&
    profile.lastName.trim() !== '' &&
    profile.email.trim() !== '' &&
    profile.birthDate.trim() !== '' &&
    profile.height > 0 &&
    profile.weight > 0 &&
    profile.sex.trim() !== ''

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile,
        clearProfile,
        isProfileComplete,
        loadingProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
