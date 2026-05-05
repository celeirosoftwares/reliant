import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reliant — A Camada de Confiabilidade para Produtos com LLM',
  description: 'Reliant fica entre seu app e qualquer LLM. Outputs estruturados garantidos, retry inteligente e observabilidade completa — para seus pipelines de IA funcionarem em produção.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/icon-512x512.png', sizes: '512x512' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
