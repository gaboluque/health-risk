import React from 'react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import './styles.css'
import './global.css'

export const metadata = {
  description:
    'Evidence-based health risk assessments and screening tools to help you understand your health status and make informed healthcare decisions.',
  title: 'Auditare Health',
  keywords:
    'health assessment, risk calculator, ASCVD, diabetes risk, anxiety screening, FRAX, GAD-7, health screening',
  authors: [{ name: 'Auditare Health' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Get user authentication status
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
          <Header user={user} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
