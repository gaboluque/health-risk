'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export interface AuthResult {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    role: 'admin' | 'client' | 'user'
  }
}

/**
 * Universal login function that works for all user roles
 */
export async function loginUser(
  email: string,
  password: string,
  expectedRole?: 'admin' | 'client' | 'user',
): Promise<AuthResult> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // First, find the user to check their role
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (userQuery.docs.length === 0) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      }
    }

    const user = userQuery.docs[0]

    // Check if user has the expected role (if specified)
    if (expectedRole && user.role !== expectedRole) {
      return {
        success: false,
        error: 'Acceso no autorizado para este portal.',
      }
    }

    // Attempt to login using PayloadCMS auth
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (loginResult.user) {
      // Set the auth cookie
      const cookieStore = await cookies()
      if (loginResult.token) {
        cookieStore.set('payload-token', loginResult.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        })
      }

      return {
        success: true,
        user: {
          id: loginResult.user.id,
          email: loginResult.user.email,
          role: loginResult.user.role as 'admin' | 'client' | 'user',
        },
      }
    }

    return {
      success: false,
      error: 'Credenciales inválidas',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Error interno del servidor. Por favor, inténtelo de nuevo.',
    }
  }
}

/**
 * Authenticates a user with personal information (email, ID, birth date)
 * Used for patient/user authentication instead of password
 */
export async function loginUserWithPersonalInfo(
  email: string,
  idNumber: string,
  birthDate: string,
): Promise<AuthResult> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find user by email and role
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            email: {
              equals: email,
            },
          },
          {
            role: {
              equals: 'user',
            },
          },
        ],
      },
      limit: 1,
    })

    if (userQuery.docs.length === 0) {
      return {
        success: false,
        error: 'No se encontró un paciente con este correo electrónico.',
      }
    }

    const user = userQuery.docs[0]

    // Verify personal information matches
    if (!user.profile) {
      return {
        success: false,
        error: 'Perfil de paciente no encontrado.',
      }
    }

    // Check ID number
    if (user.profile.idNumber !== idNumber) {
      return {
        success: false,
        error: 'La información proporcionada no coincide con nuestros registros.',
      }
    }

    // Check birth date
    if (user.profile.birthDate.substring(0, 10) !== birthDate) {
      return {
        success: false,
        error: 'La información proporcionada no coincide con nuestros registros.',
      }
    }

    // Create a custom session since we verified identity with personal info
    const cookieStore = await cookies()
    const userToken = Buffer.from(
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        loginTime: Date.now(),
      }),
    ).toString('base64')

    cookieStore.set('user-session', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as 'admin' | 'client' | 'user',
      },
    }
  } catch (error) {
    console.error('User personal info login error:', error)
    return {
      success: false,
      error: 'Error interno del servidor. Por favor, inténtelo de nuevo.',
    }
  }
}

/**
 * Universal logout function
 */
export async function logoutUser(redirectPath: string = '/'): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')
    cookieStore.delete('user-session') // Also clear custom user session
  } catch (error) {
    console.error('Logout error:', error)
  }

  redirect(redirectPath)
}

/**
 * Get the current authenticated user with role verification
 */
export async function getCurrentUser(expectedRole?: 'admin' | 'client' | 'user') {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // First try PayloadCMS authentication (for admin/client users)
    const { user } = await payload.auth({
      headers: await headers(),
    })

    if (user && (!expectedRole || user.role === expectedRole)) {
      return {
        id: user.id,
        email: user.email,
        role: user.role as 'admin' | 'client' | 'user',
      }
    }

    // If no PayloadCMS user found, check for custom user session (for personal info login)
    if (expectedRole === 'user' || !expectedRole) {
      const cookieStore = await cookies()
      const userSession = cookieStore.get('user-session')

      if (userSession) {
        try {
          const sessionData = JSON.parse(Buffer.from(userSession.value, 'base64').toString())

          // Check if session is still valid (7 days)
          if (Date.now() - sessionData.loginTime < 7 * 24 * 60 * 60 * 1000) {
            if (!expectedRole || sessionData.role === expectedRole) {
              return {
                id: sessionData.id,
                email: sessionData.email,
                role: sessionData.role,
              }
            }
          }
        } catch (sessionError) {
          console.error('User session parsing error:', sessionError)
        }
      }
    }

    return null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Authenticates or creates a user with complete profile information
 * If user exists, logs them in and updates their profile
 * If user doesn't exist, creates them and logs them in
 */
export async function loginOrCreateUserWithProfile(profile: {
  firstName: string
  lastName: string
  email: string
  birthDate: string
  height: number
  weight: number
  sex: 'male' | 'female'
  currentSmoking?: boolean
  idNumber: string
  socialSecurityNumber?: string
  cellphoneNumber: string
  privateInsurance?: string
  age?: number
  bmi?: number
  createdAt?: string
}): Promise<AuthResult> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Check if user already exists by email
    const existingUserQuery = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: profile.email,
        },
      },
      limit: 1,
    })

    let user: any

    if (existingUserQuery.docs.length > 0) {
      // User exists - update their profile and log them in
      user = existingUserQuery.docs[0]

      // Update the user's profile with new information
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          profile: profile,
        },
      })
    } else {
      // User doesn't exist - create new user
      user = await payload.create({
        collection: 'users',
        data: {
          email: profile.email,
          role: 'user',
          profile: profile,
          // Generate a temporary password - users don't use passwords, they use personal info
          password: Math.random().toString(36).slice(-12),
        },
      })
    }

    // Create a custom session since we verified identity with personal info
    const cookieStore = await cookies()
    const userToken = Buffer.from(
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        loginTime: Date.now(),
      }),
    ).toString('base64')

    cookieStore.set('user-session', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: (user.role || 'user') as 'admin' | 'client' | 'user',
      },
    }
  } catch (error) {
    console.error('Login or create user error:', error)
    return {
      success: false,
      error: 'Error interno del servidor. Por favor, inténtelo de nuevo.',
    }
  }
}

/**
 * Role-specific authentication helpers
 * Note: Admin users should use PayloadCMS admin interface
 */
export async function getCurrentClientUser() {
  return await getCurrentUser('client')
}

export async function getCurrentRegularUser() {
  return await getCurrentUser('user')
}

/**
 * Check if user has access to a specific role's routes
 */
export async function checkRoleAccess(requiredRole: 'admin' | 'client' | 'user'): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === requiredRole
}
