import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''

  // Skip authentication for login page to prevent infinite redirect
  if (pathname.includes('/client/login')) {
    return <>{children}</>
  }

  const payload = await getPayload({ config })
  // Get the current user from the session
  const { user } = await payload.auth({ headers: headersList })

  if (!user || user.role !== 'client') redirect('/')

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--header-height': '4rem',
        } as React.CSSProperties
      }
    >
      <AdminSidebar user={user as { email: string; role: 'admin' | 'client' }} />
      <SidebarInset>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
