'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MoreVertical } from 'lucide-react'

export function MobileHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
      <Button variant="ghost" size="icon" className="size-7 -ml-1" onClick={toggleSidebar}>
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
          <span className="text-xs font-bold text-white">A</span>
        </div>
        <span className="font-semibold">Auditare Health</span>
      </div>
    </header>
  )
}
