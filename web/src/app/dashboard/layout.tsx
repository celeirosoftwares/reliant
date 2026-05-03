'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      // Wait a tick to ensure cookies are available
      await new Promise(r => setTimeout(r, 100))

      const { data: { session }, error } = await supabase.auth.getSession()

      console.log('Session check:', { session: !!session, error })

      if (!session) {
        router.replace('/auth/login')
        return
      }

      setUser(session.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profileData)
      setLoading(false)
      setChecked(true)
    }

    init()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'var(--font-ui-mono)', color: '#555', fontSize: '13px' }}>
        <div>Carregando...</div>
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