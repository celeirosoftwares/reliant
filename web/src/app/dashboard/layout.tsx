'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/dashboard/Sidebar'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()

      console.log('INIT session:', session?.user?.email, 'expires:', session?.expires_at)

      if (!session) {
        console.log('NO SESSION - redirecting')
        window.location.href = '/auth/login'
        return
      }

      setUser(session.user)
      setAuthed(true)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profileData)
      setLoading(false)
    }

    init()
  }, [])

  if (!authed || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'var(--font-ui-mono)', color: '#555', fontSize: '13px' }}>
        Carregando...
      </div>
    )
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
