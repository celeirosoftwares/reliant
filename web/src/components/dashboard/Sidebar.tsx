'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from './Sidebar.module.css'

interface Props {
  user: { email?: string; id?: string }
  profile: { full_name?: string; plan?: string; reliant_api_key?: string } | null
}

const PLAN_LIMITS: Record<string, number> = {
  free: 1000,
  starter: 50000,
  pro: 250000,
  scale: 1000000,
  enterprise: -1,
}

const navItems = [
  {
    section: 'Monitorar',
    items: [
      { href: '/dashboard', label: 'Visão Geral', icon: '▤' },
      { href: '/dashboard/executions', label: 'Execuções', icon: '≡' },
    ],
  },
  {
    section: 'Configurar',
    items: [
      { href: '/dashboard/schemas', label: 'Schemas', icon: '❑' },
      { href: '/dashboard/providers', label: 'Providers de IA', icon: '⚡' },
      { href: '/dashboard/settings', label: 'Configurações', icon: '⚙' },
    ],
  },
  {
    section: 'Conta',
    items: [
      { href: '/dashboard/upgrade', label: 'Planos & Uso', icon: '📊' },
      { href: '/docs', label: 'Documentação', icon: '📖' },
    ],
  },
]

export default function Sidebar({ user, profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [usageCount, setUsageCount] = useState<number | null>(null)

  useEffect(() => {
    async function loadUsage() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const period = new Date().toISOString().slice(0, 7)
      const { data } = await supabase
        .from('usage')
        .select('executions_count')
        .eq('user_id', session.user.id)
        .eq('period', period)
        .single()
      if (data) setUsageCount(data.executions_count)
    }
    loadUsage()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const plan = profile?.plan || 'free'
  const limit = PLAN_LIMITS[plan] || 1000
  const usagePercent = usageCount && limit > 0 ? Math.min(100, Math.round((usageCount / limit) * 100)) : 0

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/logo-icon.png" width={28} height={28} style={{ borderRadius: '3px' }} alt="Reliant" />
        <div>
          <div className={styles.logoText}>Reliant</div>
          <div className={styles.logoVersion}>v1.0.0 · production</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map(group => (
          <div key={group.section}>
            <div className={styles.navSection}>{group.section}</div>
            {group.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.bottom}>
        {/* Usage bar */}
        {usageCount !== null && limit > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555', marginBottom: '5px' }}>
              <span>Uso mensal</span>
              <span style={{ color: usagePercent >= 90 ? '#ff4444' : '#555' }}>
                {usageCount.toLocaleString()} / {limit.toLocaleString()}
              </span>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                width: `${usagePercent}%`,
                background: usagePercent >= 90 ? '#ff4444' : usagePercent >= 70 ? '#ffbb00' : 'var(--accent)',
                transition: 'width 0.3s',
              }} />
            </div>
            {usagePercent >= 80 && (
              <Link href="/dashboard/upgrade" style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#ffbb00', textDecoration: 'none', display: 'block', marginTop: '4px' }}>
                ⚠️ Fazer upgrade →
              </Link>
            )}
          </div>
        )}

        <div className={styles.userCard}>
          <div className={styles.userName}>
            {profile?.full_name || user.email?.split('@')[0]}
          </div>
          <div className={styles.userEmail}>{user.email}</div>
          <div className={styles.planBadge}>{plan}</div>
        </div>

        {profile?.reliant_api_key && (
          <div className={styles.apiKeyCard}>
            <div className={styles.apiKeyLabel}>API Key</div>
            <div className={styles.apiKeyValue}>
              {profile.reliant_api_key.substring(0, 16)}...
            </div>
          </div>
        )}

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </aside>
  )
}
