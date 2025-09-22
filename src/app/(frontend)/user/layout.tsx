import React from 'react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ClientHeader } from '@/components/ui/ClientHeader'
import { Footer } from '@/components/ui/footer'
import { UserProfileProvider } from '@/contexts/UserProfileContext'
import { redirect } from 'next/navigation'

export default async function UserLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Get user authentication status
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // For client users, provide a simple layout that lets the admin route handle things
  if (user?.role === 'client') {
    redirect('/client')
  }

  return (
    <UserProfileProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <ClientHeader user={user} />
        <main className="p-2 md:p-4 flex justify-center">{children}</main>
      </div>
    </UserProfileProvider>
  )
}
