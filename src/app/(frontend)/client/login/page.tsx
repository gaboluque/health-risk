import { ClientLoginForm } from '@/components/auth/ClientLoginForm'
import { getCurrentClientUser } from '@/lib/actions/client-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Iniciar Sesión - Cliente | Auditare Health',
  description: 'Acceso para clientes de Auditare Health',
}

export default async function ClientLoginPage() {
  const user = await getCurrentClientUser()

  if (user) {
    redirect('/client')
  }

  return <ClientLoginForm />
}
