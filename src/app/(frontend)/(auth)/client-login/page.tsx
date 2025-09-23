import { UniversalLoginForm } from '@/components/auth/UniversalLoginForm'
import { getCurrentClientUser } from '@/lib/auth/auth-utils'
import { redirect } from 'next/navigation'

export default async function ClientLoginPage() {
  // If already logged in as client, redirect to dashboard
  const user = await getCurrentClientUser()
  if (user) {
    redirect('/client')
  }

  return <UniversalLoginForm role="client" />
}
