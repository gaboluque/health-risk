'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface ClientLoginResult {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * Authenticates a client user and creates a session
 */
export async function loginClient(email: string, password: string): Promise<ClientLoginResult> {
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

    // Check if user has client role
    if (user.role !== 'client') {
      return {
        success: false,
        error: 'Acceso no autorizado. Esta cuenta no tiene permisos de cliente.',
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
          role: loginResult.user.role,
        },
      }
    }

    return {
      success: false,
      error: 'Credenciales inválidas',
    }
  } catch (error) {
    console.error('Client login error:', error)
    return {
      success: false,
      error: 'Error interno del servidor. Por favor, inténtelo de nuevo.',
    }
  }
}

/**
 * Logs out the current client user
 */
export async function logoutClient(): Promise<void> {
  try {
    // Clear the auth cookie
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')
  } catch (error) {
    console.error('Client logout error:', error)
  }

  redirect('/')
}

/**
 * Gets the current authenticated client user
 */
export async function getCurrentClientUser() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { user } = await payload.auth({
      headers: await import('next/headers').then((mod) => mod.headers()),
    })

    if (user && user.role === 'client') {
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    }

    return null
  } catch (error) {
    console.error('Get current client user error:', error)
    return null
  }
}
