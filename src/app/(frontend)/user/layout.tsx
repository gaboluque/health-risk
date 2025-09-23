import React from 'react'
import { ClientHeader } from '@/components/ui/ClientHeader'
import { UserProfileProvider } from '@/contexts/UserProfileContext'
import { redirect } from 'next/navigation'
import { getCurrentRegularUser } from '@/lib/auth/auth-utils'

export default async function UserLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const user = await getCurrentRegularUser()

  if (!user) {
    redirect('/user-login')
  }

  return (
    <UserProfileProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <ClientHeader />
        <main className="p-2 md:p-4 flex justify-center">{children}</main>
      </div>
    </UserProfileProvider>
  )
}
