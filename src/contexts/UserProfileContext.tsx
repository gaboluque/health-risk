'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { enrichProfileWithCalculations } from '@/lib/utils/health-calculations'
import { getUserProfile } from '@/lib/actions/get-user-profile'
import type { UserProfile, UserProfileContextType } from '@/lib/types/user-profile'

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile from server on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        const result = await getUserProfile()

        if (result.success && result.profile) {
          // Re-calculate age and BMI in case they've changed
          const enrichedProfile = enrichProfileWithCalculations(result.profile)
          setProfileState(enrichedProfile)
          setError(null)
        } else {
          setError(result.error || 'Error al cargar el perfil')
          setProfileState(null)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setError('Error al cargar el perfil')
        setProfileState(null)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  const setProfile = (newProfile: UserProfile) => {
    // Ensure calculated values are up to date
    const enrichedProfile = enrichProfileWithCalculations(newProfile)
    setProfileState(enrichedProfile)
    // Note: Since users now login with complete profile data,
    // we don't need to persist to client storage anymore
  }

  const clearProfile = () => {
    setProfileState(null)
    setError(null)
  }

  // Since users now login with complete profile data, they should always have a complete profile
  const isProfileComplete = profile !== null && !error

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile,
        clearProfile,
        isProfileComplete,
        loadingProfile,
        isHydrated: true, // Always hydrated since we fetch from server
        error,
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
