'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentRegularUser } from '@/lib/auth/auth-utils'
import type { UserProfile } from '@/lib/types/user-profile'

export interface GetUserProfileResult {
  success: boolean
  profile?: UserProfile
  error?: string
}

/**
 * Fetches the current user's profile from the database
 */
export async function getUserProfile(): Promise<GetUserProfileResult> {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentRegularUser()

    if (!currentUser) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      }
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch the user with their profile data
    const user = await payload.findByID({
      collection: 'users',
      id: currentUser.id,
    })

    if (!user || !user.profile) {
      return {
        success: false,
        error: 'Perfil de usuario no encontrado',
      }
    }

    return {
      success: true,
      profile: user.profile as UserProfile,
    }
  } catch (error) {
    console.error('Get user profile error:', error)
    return {
      success: false,
      error: 'Error interno del servidor',
    }
  }
}
