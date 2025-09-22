import { redirect } from 'next/navigation'
import { getCurrentClientUser } from '@/lib/actions/client-auth'
import { ClientLoginForm } from '@/components/auth/ClientLoginForm'

export const metadata = {
  title: 'Iniciar Sesión - Cliente | Auditare Health',
  description: 'Acceso para clientes de Auditare Health',
}

export default async function ClientLoginPage() {
  // Check if user is already logged in as a client
  const currentUser = await getCurrentClientUser()

  if (currentUser) {
    redirect('/private/admin')
  }

  return <ClientLoginForm />
}
