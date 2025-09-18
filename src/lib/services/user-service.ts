'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'
import type { UserProfile } from '@/lib/types/user-profile'
import { randomBytes } from 'node:crypto'

export interface FindOrCreateUserParams {
  profile: UserProfile
}

export interface FindOrCreateUserResult {
  user: User
  isNewUser: boolean
}

/**
 * Generates a secure random password for auto-created users
 */
function generateSecurePassword(): string {
  return randomBytes(32).toString('base64')
}

/**
 * Finds an existing user by name and ID number, or creates a new one if not found
 */
export async function findOrCreateUser({
  profile,
}: FindOrCreateUserParams): Promise<FindOrCreateUserResult> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // First, try to find an existing user by ID number (most reliable identifier)
    const existingUserByIdNumber = await payload.find({
      collection: 'users',
      where: {
        'profile.idNumber': {
          equals: profile.idNumber,
        },
      },
    })

    if (existingUserByIdNumber.docs.length > 0) {
      return {
        user: existingUserByIdNumber.docs[0] as User,
        isNewUser: false,
      }
    }

    // If no user found by ID number, try to find by email
    const existingUserByEmail = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: profile.email,
        },
      },
    })

    if (existingUserByEmail.docs.length > 0) {
      return {
        user: existingUserByEmail.docs[0] as User,
        isNewUser: false,
      }
    }

    // If no user found by either ID or email, try to find by name combination
    const existingUserByName = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            'profile.firstName': {
              equals: profile.firstName,
            },
          },
          {
            'profile.lastName': {
              equals: profile.lastName,
            },
          },
        ],
      },
    })

    if (existingUserByName.docs.length > 0) {
      return {
        user: existingUserByName.docs[0] as User,
        isNewUser: false,
      }
    }

    // No existing user found, create a new one
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: profile.email,
        password: generateSecurePassword(), // Generate a secure password for auto-created users
        role: 'user', // Default role for new users
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate,
          height: profile.height,
          weight: profile.weight,
          sex: profile.sex as 'male' | 'female',
          currentSmoking: profile.currentSmoking || false,
          idNumber: profile.idNumber,
          socialSecurityNumber: profile.socialSecurityNumber,
          cellphoneNumber: profile.cellphoneNumber,
          privateInsurance: profile.privateInsurance,
          // age and bmi will be calculated automatically by the hooks
        },
      },
    })

    return {
      user: newUser as User,
      isNewUser: true,
    }
  } catch (error) {
    console.error('Error in findOrCreateUser:', error)
    throw new Error(
      `Failed to find or create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Updates an existing user's profile information
 */
export async function updateUserProfile(userId: string, profile: UserProfile): Promise<User> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        email: profile.email,
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate,
          height: profile.height,
          weight: profile.weight,
          sex: profile.sex as 'male' | 'female',
          currentSmoking: profile.currentSmoking || false,
          idNumber: profile.idNumber,
          socialSecurityNumber: profile.socialSecurityNumber,
          cellphoneNumber: profile.cellphoneNumber,
          privateInsurance: profile.privateInsurance,
          // age and bmi will be calculated automatically by the hooks
        },
      },
    })

    return updatedUser
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error(
      `Failed to update user profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
