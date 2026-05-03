'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/dashboard/Sidebar'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading')

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setStatus('unauthed')
        return
      }

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

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'var(--font-ui-mono)', color: '#555', fontSize: '13px' }}>
        Carregando...
      </div>
    )
  }

  if (status === 'unauthed') {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return null
  }

  return (
    <div className={styles.layout}>
      <Sidebar user={user} profile={profile} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}