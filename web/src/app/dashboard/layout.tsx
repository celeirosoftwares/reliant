'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setStatus('unauthed'); return }
      setUser(session.user)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(profileData)
      setStatus('authed')
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'var(--font-ui-mono)', color: '#555', fontSize: '13px' }}>
        Carregando...
      </div>
    )
  }

  if (status === 'unauthed') {
    if (typeof window !== 'undefined') window.location.href = '/auth/login'
    return null
  }

  const plan = profile?.plan || 'free'
  const displayName = profile?.full_name || user?.email?.split('@')[0] || ''

  return (
    <div className={styles.layout}>
      <Sidebar profile={profile} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: '52px',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px',
          gap: '12px',
          background: '#0a0a0a',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555' }}>
            {user?.email}
          </span>
          <Link
            href="/dashboard/upgrade"
            style={{
              display: 'inline-flex',
              padding: '3px 10px',
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: '100px',
              fontFamily: 'var(--font-ui-mono)',
              fontSize: '11px',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            {plan}
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '5px 12px',
              background: 'transparent',
              border: '1px solid #222',
              borderRadius: '4px',
              fontFamily: 'var(--font-ui-mono)',
              fontSize: '11px',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Sair
          </button>
        </header>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}
