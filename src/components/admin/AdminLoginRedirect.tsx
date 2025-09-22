'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'

/**
 * Component that redirects users based on their role after PayloadCMS login
 * - Admin users: stay in PayloadCMS admin panel
 * - Client users: redirect to custom client dashboard
 * - Regular users: redirect to client login (they shouldn't use PayloadCMS admin)
 */
export function AdminLoginRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === 'client') {
        // Redirect client users to custom dashboard
        router.push('/private/admin')
      } else if (user.role === 'user') {
        // Regular users shouldn't be in admin panel, redirect to client login
        router.push('/client/login')
      }
      // Admin users stay in PayloadCMS admin panel (no redirect needed)
    }
  }, [user, router])

  // Return null as this is just a redirect component
  return null
}
