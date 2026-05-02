'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import styles from './Sidebar.module.css'

interface Props {
  user: { email?: string }
  profile: { full_name?: string; plan?: string; reliant_api_key?: string } | null
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
      { href: '/dashboard/settings', label: 'Configurações', icon: '⚙' },
    ],
  },
]

export default function Sidebar({ user, profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>R</div>
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
        <div className={styles.userCard}>
          <div className={styles.userName}>
            {profile?.full_name || user.email?.split('@')[0]}
          </div>
          <div className={styles.userEmail}>{user.email}</div>
          <div className={styles.planBadge}>
            {profile?.plan || 'free'}
          </div>
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
