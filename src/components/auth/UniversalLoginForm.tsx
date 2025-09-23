'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loginUser } from '@/lib/auth/auth-utils'
import { getRoleRedirectPaths } from '@/lib/auth/auth-config'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

interface UniversalLoginFormProps {
  role: 'admin' | 'client' | 'user'
  title?: string
  description?: string
  redirectAfterLogin?: string
}

const roleConfig = {
  admin: {
    title: 'Acceso Administrador',
    description: 'Ingrese sus credenciales de administrador para acceder al panel de control.',
    placeholder: 'admin@auditare.com',
  },
  client: {
    title: 'Portal Cliente',
    description: 'Acceda a su portal de cliente para gestionar usuarios y ver reportes.',
    placeholder: 'cliente@empresa.com',
  },
  user: {
    title: 'Portal Paciente',
    description: 'Acceda a su perfil para completar cuestionarios de salud.',
    placeholder: 'paciente@email.com',
  },
}

export function UniversalLoginForm({
  role,
  title,
  description,
  redirectAfterLogin,
}: UniversalLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const config = roleConfig[role]
  const redirectPaths = getRoleRedirectPaths(role)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await loginUser(email, password, role)

      if (result.success) {
        const destination = redirectAfterLogin || redirectPaths.dashboard
        router.push(destination)
        router.refresh()
      } else {
        setError(result.error || 'Error al iniciar sesión')
      }
    } catch (_error) {
      setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{title || config.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description || config.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={config.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
