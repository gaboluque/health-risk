'use client'

import * as React from 'react'
import { BarChart3, Users, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { User } from '@/payload-types'

interface ClientSidebarProps {
  user: User
}

const navigationItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/client',
    badge: null,
  },
  {
    title: 'Usuarios',
    icon: Users,
    href: '/client/users',
    badge: null,
  },
]

export function ClientSidebar({ user }: ClientSidebarProps) {
  const pathname = usePathname()

  if (user?.role !== 'client') return null

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Auditare Health</h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full">
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
              {user.email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
        </div>
        <div className="px-3 pb-2">
          <LogoutButton
            variant="outline"
            size="sm"
            className="w-full justify-start"
            showIcon={true}
            showText={true}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
