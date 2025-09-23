import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/auth-utils'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, User, Heart } from 'lucide-react'

export default async function HomePage() {
  // Check if user is already logged in and redirect to their dashboard
  const user = await getCurrentUser()

  if (user) {
    switch (user.role) {
      case 'admin':
        // Admin users should use PayloadCMS admin interface
        redirect('/admin')
      case 'client':
        redirect('/client')
      case 'user':
        redirect('/user')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Auditare Health</h1>
              <p className="text-sm text-muted-foreground">Sistema de Evaluación de Riesgo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Bienvenido a Auditare Health</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma integral para la evaluación y gestión de riesgos de salud. Seleccione su tipo
            de acceso para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Client Access */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl">Cliente Empresarial</CardTitle>
              <CardDescription>Portal para empresas y organizaciones</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/client-login">Acceder como Cliente</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Gestión de empleados y reportes empresariales
              </p>
            </CardContent>
          </Card>

          {/* User Access */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl">Paciente</CardTitle>
              <CardDescription>Acceso personal para completar evaluaciones</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/user-login">Acceder como Paciente</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Cuestionarios de salud y seguimiento personal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-muted-foreground">
          <p className="text-sm">
            ¿No tienes una cuenta? Contacta con tu administrador para obtener acceso.
          </p>
          <p className="text-xs mt-2">
            Los administradores pueden acceder a{' '}
            <Link href="/admin" className="text-primary hover:underline">
              PayloadCMS Admin
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
