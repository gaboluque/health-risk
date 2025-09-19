'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { enrichProfileWithCalculations } from '@/lib/utils/health-calculations'
import { useClientStorage } from '@/hooks/useClientStorage'
import type { UserProfile, UserProfileContextType } from '@/lib/types/user-profile'

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [storedProfile, setStoredProfile, removeStoredProfile, isHydrated] =
    useClientStorage<UserProfile | null>('userProfile', null)
  const [profile, setProfileState] = useState<UserProfile | null>(null)

  // Loading state - true until hydration is complete
  const loadingProfile = !isHydrated

  // Enrich profile when stored profile changes (after hydration)
  useEffect(() => {
    if (isHydrated && storedProfile) {
      try {
        // Re-calculate age and BMI in case they've changed since last storage
        const enrichedProfile = enrichProfileWithCalculations(storedProfile)
        setProfileState(enrichedProfile)
      } catch (error) {
        console.error('Error enriching stored profile:', error)
        // If enrichment fails, clear the stored profile
        removeStoredProfile()
        setProfileState(null)
      }
    } else if (isHydrated && !storedProfile) {
      // No stored profile after hydration
      setProfileState(null)
    }
  }, [storedProfile, isHydrated, removeStoredProfile])

  const setProfile = (newProfile: UserProfile) => {
    const profileWithTimestamp = {
      ...newProfile,
      createdAt: new Date().toISOString(),
    }
    // Ensure calculated values are up to date
    const enrichedProfile = enrichProfileWithCalculations(profileWithTimestamp)
    setProfileState(enrichedProfile)
    setStoredProfile(enrichedProfile)
  }

  const clearProfile = () => {
    setProfileState(null)
    removeStoredProfile()
  }

  const isProfileComplete =
    profile !== null &&
    profile.firstName.trim() !== '' &&
    profile.lastName.trim() !== '' &&
    profile.email.trim() !== '' &&
    profile.birthDate.trim() !== '' &&
    profile.height > 0 &&
    profile.weight > 0 &&
    profile.sex &&
    profile.idNumber?.trim() !== '' &&
    profile.cellphoneNumber?.trim() !== ''

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile,
        clearProfile,
        isProfileComplete,
        loadingProfile,
        isHydrated,
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
