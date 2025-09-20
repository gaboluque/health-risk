'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'

/**
 * Component that redirects admin users to the custom admin dashboard
 * after successful login to the Payload admin panel
 */
export function AdminLoginRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      // Redirect admin users to custom dashboard
      router.push('/private/admin')
    }
  }, [user, router])

  // Return null as this is just a redirect component
  return null
}
