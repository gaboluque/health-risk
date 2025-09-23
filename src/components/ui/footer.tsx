'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'

export function Footer() {
  const { user } = useAuth()

  return (
    <section className="bg-slate-900 text-slate-400 py-12">
      <div className="flex items-center justify-around">
        <div className="text-center text-sm">
          <p>&copy; 2025 Auditare Health. All rights reserved.</p>
        </div>
        <div className="text-center text-sm">
          {user?.role === 'client' ? <Link href="/client/login">Ingreso de Clientes</Link> : null}
        </div>
      </div>
    </section>
  )
}
