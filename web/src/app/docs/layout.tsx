'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    section: 'Introdução',
    items: [
      { href: '/docs', label: 'O que é o Reliant?' },
      { href: '/docs/quickstart', label: 'Quickstart' },
    ],
  },
  {
    section: 'Conceitos',
    items: [
      { href: '/docs/schemas', label: 'Schemas' },
      { href: '/docs/execute', label: 'Execute & Retry' },
      { href: '/docs/observability', label: 'Observabilidade' },
      { href: '/docs/fallbacks', label: 'Safe Fallbacks' },
    ],
  },
  {
    section: 'SDKs',
    items: [
      { href: '/docs/sdk-js', label: 'JavaScript / TypeScript' },
      { href: '/docs/sdk-python', label: 'Python' },
      { href: '/docs/sdk-php', label: 'PHP' },
    ],
  },
  {
    section: 'Integrações',
    items: [
      { href: '/docs/integrations/n8n', label: 'n8n' },
    ],
  },
  {
    section: 'API Reference',
    items: [
      { href: '/docs/api/execute', label: 'POST /execute' },
      { href: '/docs/api/schemas', label: 'Schemas' },
      { href: '/docs/api/executions', label: 'Executions' },
      { href: '/docs/api/metrics', label: 'Metrics' },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{
        width: '260px',
        minHeight: '100vh',
        background: '#0d0d0d',
        borderRight: '1px solid #1e1e1e',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        overflowY: 'auto',
        zIndex: 100,
      }}>
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #1e1e1e' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
            <img src="/logo-icon.png" width={28} height={28} style={{ borderRadius: '3px' }} alt="Reliant" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--text)' }}>Reliant</span>
          </Link>
          <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', background: '#1a1a1a', border: '1px solid #222', borderRadius: '3px', padding: '4px 10px', display: 'inline-block' }}>
            Documentação v1.0
          </div>
        </div>

        <nav style={{ padding: '16px 0' }}>
          {navigation.map(group => (
            <div key={group.section}>
              <div style={{ padding: '8px 24px 4px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: 500 }}>
                {group.section}
              </div>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '7px 24px',
                    fontFamily: 'var(--font-ui-mono)',
                    fontSize: '13px',
                    color: pathname === item.href ? 'var(--accent)' : '#666',
                    textDecoration: 'none',
                    background: pathname === item.href ? 'rgba(0,255,136,0.06)' : 'transparent',
                    borderLeft: `2px solid ${pathname === item.href ? 'var(--accent)' : 'transparent'}`,
                    marginLeft: '-1px',
                    transition: 'all 0.15s',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #1e1e1e', marginTop: 'auto' }}>
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555', textDecoration: 'none' }}>
            ← Voltar ao Dashboard
          </Link>
        </div>
      </aside>

      <main style={{ marginLeft: '260px', flex: 1, padding: '64px 80px', maxWidth: '900px' }}>
        {children}
      </main>
    </div>
  )
}
