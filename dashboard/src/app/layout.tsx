// src/app/layout.tsx — Root layout
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reliant — LLM Reliability Dashboard',
  description: 'Monitor, validate, and debug your LLM integrations in real time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
