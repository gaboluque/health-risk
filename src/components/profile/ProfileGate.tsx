'use client'

import React from 'react'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileGateProps {
  children: React.ReactNode
}

export function ProfileGate({ children }: ProfileGateProps) {
  const { isProfileComplete, loadingProfile, error } = useUserProfile()

  if (loadingProfile) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Cargando tu perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el perfil</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isProfileComplete) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Perfil incompleto</h3>
              <p className="text-sm text-yellow-700 mb-4">
                Tu perfil parece estar incompleto. Por favor, inicia sesión nuevamente para
                actualizar tu información.
              </p>
              <Button
                onClick={() => (window.location.href = '/user-login')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Ir a iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
