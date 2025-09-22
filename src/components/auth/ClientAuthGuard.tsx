'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentClientUser } from '@/lib/actions/client-auth'

interface ClientAuthGuardProps {
  children: React.ReactNode
}

export function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentClientUser()
        if (user) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/client/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Show children only if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // This should not render as we redirect above, but just in case
  return null
}
