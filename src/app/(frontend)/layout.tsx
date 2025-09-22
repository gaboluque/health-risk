import React from 'react'
import './styles.css'
import './global.css'
import { Footer } from '@/components/ui/footer'

export const metadata = {
  description:
    'Evidence-based health risk assessments and screening tools to help you understand your health status and make informed healthcare decisions.',
  title: 'Auditare Health',
  keywords:
    'health assessment, risk calculator, ASCVD, diabetes risk, anxiety screening, FRAX, GAD-7, health screening',
  authors: [{ name: 'Auditare Health' }],
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
