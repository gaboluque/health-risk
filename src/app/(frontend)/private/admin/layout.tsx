import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })

  // Get the current user from the session
  const { user } = await payload.auth({ headers: await headers() })

  // Check if user is authenticated and has admin or client role
  if (!user || (user.role !== 'admin' && user.role !== 'client')) {
    redirect('/client/login') // Redirect to custom client login
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
      <AdminSidebar user={user as { email: string; role: 'admin' | 'client' }} />
      <SidebarInset>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
