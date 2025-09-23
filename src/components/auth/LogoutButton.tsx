'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/lib/auth/auth-utils'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
  showText?: boolean
  redirectPath?: string
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  className,
  showIcon = true,
  showText = true,
  redirectPath = '/',
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logoutUser(redirectPath)
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && (isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión')}
    </Button>
  )
}
