import { UserLoginForm } from '@/components/auth/UserLoginForm'
import { getCurrentRegularUser } from '@/lib/auth/auth-utils'
import { redirect } from 'next/navigation'

export default async function UserLoginPage() {
  // If already logged in as user, redirect to dashboard
  const user = await getCurrentRegularUser()
  if (user) {
    redirect('/user')
  }

  return <UserLoginForm />
}
