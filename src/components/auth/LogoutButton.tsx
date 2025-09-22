'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { logoutClient } from '@/lib/actions/client-auth'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  className,
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logoutClient()
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
