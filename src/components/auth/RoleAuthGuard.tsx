'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/auth-utils'
import { getRoleRedirectPaths } from '@/lib/auth/auth-config'

interface RoleAuthGuardProps {
  children: React.ReactNode
  requiredRole: 'admin' | 'client' | 'user'
  loadingComponent?: React.ReactNode
}

export function RoleAuthGuard({ children, requiredRole, loadingComponent }: RoleAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser(requiredRole)
        if (user) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          const redirectPaths = getRoleRedirectPaths(requiredRole)
          router.push(redirectPaths.login)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        const redirectPaths = getRoleRedirectPaths(requiredRole)
        router.push(redirectPaths.unauthorized)
      }
    }

    checkAuth()
  }, [router, requiredRole])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      loadingComponent || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando autenticación...</p>
          </div>
        </div>
      )
    )
  }

  // Show children only if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // This should not render as we redirect above, but just in case
  return null
}

// Convenience components for each role
export function AdminAuthGuard({
  children,
  loadingComponent,
}: Omit<RoleAuthGuardProps, 'requiredRole'>) {
  return (
    <RoleAuthGuard requiredRole="admin" loadingComponent={loadingComponent}>
      {children}
    </RoleAuthGuard>
  )
}

export function ClientAuthGuard({
  children,
  loadingComponent,
}: Omit<RoleAuthGuardProps, 'requiredRole'>) {
  return (
    <RoleAuthGuard requiredRole="client" loadingComponent={loadingComponent}>
      {children}
    </RoleAuthGuard>
  )
}

export function UserAuthGuard({
  children,
  loadingComponent,
}: Omit<RoleAuthGuardProps, 'requiredRole'>) {
  return (
    <RoleAuthGuard requiredRole="user" loadingComponent={loadingComponent}>
      {children}
    </RoleAuthGuard>
  )
}
