import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reliant — LLM Reliability Layer',
  description: 'Outputs estruturados garantidos, retry inteligente e observabilidade completa para seus pipelines de IA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
