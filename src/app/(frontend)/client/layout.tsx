import { ClientSidebar } from '@/components/navigation/ClientSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation'
import { User } from '@/payload-types'
import { getCurrentClientUser } from '@/lib/auth/auth-utils'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentClientUser()

  if (!user) {
    redirect('/client-login')
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--header-height': '4rem',
        } as React.CSSProperties
      }
    >
      <ClientSidebar user={user as User} />
      <SidebarInset>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
