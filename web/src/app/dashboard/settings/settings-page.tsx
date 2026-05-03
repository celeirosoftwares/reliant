'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(data)
    }
    init()
  }, [])

  function copyKey() {
    if (profile?.reliant_api_key) {
      navigator.clipboard.writeText(profile.reliant_api_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fieldStyle = { width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: '#888', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }
  const labelStyle = { fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>configurações</span></div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Configurações</div>
            <div className={styles.sectionSub}>Conexão e configuração da API</div>
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '24px', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Plano</label>
            <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--accent)' }}>
              {profile?.plan || 'free'}
            </div>
          </div>
          <div>
            <label style={labelStyle}>API Endpoint</label>
            <input readOnly value={profile?.reliant_api_url || 'https://reliant-production.up.railway.app'} style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>API Key</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input readOnly value={profile?.reliant_api_key || '—'} type="password" style={{ ...fieldStyle, flex: 1 }} />
              <button onClick={copyKey} style={{ padding: '8px 14px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
