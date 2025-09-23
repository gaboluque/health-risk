import { ClientLoginForm } from '@/components/auth/ClientLoginForm'
import { getCurrentClientUser } from '@/lib/actions/client-auth'
import { redirect } from 'next/navigation'

export default async function ClientLoginPage() {
  const user = await getCurrentClientUser()

  if (user) {
    redirect('/client')
  }

  return <ClientLoginForm />
}
