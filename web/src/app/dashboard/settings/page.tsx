'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUserId(session.user.id)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(data)
    }
    init()
  }, [])

  function copy(value: string, key: string) {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const baseUrl = profile?.reliant_api_url || 'https://reliant-production.up.railway.app'

  const fieldStyle: React.CSSProperties = { width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: '#888', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }

  function CopyField({ label, value, fieldKey, secret }: { label: string; value: string; fieldKey: string; secret?: boolean }) {
    return (
      <div>
        <label style={labelStyle}>{label}</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input readOnly value={value || '—'} type={secret ? 'password' : 'text'} style={{ ...fieldStyle, flex: 1 }} />
          <button
            onClick={() => copy(value, fieldKey)}
            style={{ padding: '8px 14px', background: copied === fieldKey ? 'rgba(0,255,136,0.1)' : 'transparent', color: copied === fieldKey ? 'var(--accent)' : '#888', border: `1px solid ${copied === fieldKey ? 'rgba(0,255,136,0.3)' : '#222'}`, borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
          >
            {copied === fieldKey ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>configurações</span></div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Configurações</div>
            <div className={styles.sectionSub}>Credenciais e endpoints da API</div>
          </div>
        </div>

        {/* Plan */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '24px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={labelStyle}>Plano</label>
            <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--accent)' }}>
              {profile?.plan || 'free'}
            </div>
          </div>

          <CopyField label="Reliant API Key" value={profile?.reliant_api_key || ''} fieldKey="apikey" secret />
          <CopyField label="User ID" value={userId} fieldKey="userid" />
        </div>

        {/* Endpoints */}
        <div className={styles.sectionHeader} style={{ marginTop: '8px' }}>
          <div>
            <div className={styles.sectionTitle} style={{ fontSize: '16px' }}>Endpoints</div>
            <div className={styles.sectionSub}>Use esses endpoints nas suas requisições</div>
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '24px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <CopyField label="Execute — POST" value={`${baseUrl}/execute`} fieldKey="execute" />
          <CopyField label="Schemas — GET / POST" value={`${baseUrl}/schemas`} fieldKey="schemas" />
          <CopyField label="Executions — GET" value={`${baseUrl}/executions`} fieldKey="executions" />
          <CopyField label="Metrics — GET" value={`${baseUrl}/metrics/summary`} fieldKey="metrics" />

          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exemplo de requisição</div>
            <pre style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#666', lineHeight: 1.8, overflow: 'auto', margin: 0 }}>{`POST ${baseUrl}/execute
Headers:
  Content-Type: application/json
  X-Reliant-Key: ${profile?.reliant_api_key?.substring(0, 16) || 'rel_...'}...

Body:
{
  "prompt": "seu prompt aqui",
  "schema_id": "id-do-schema",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "user_id": "${userId || 'seu-user-id'}"
}`}</pre>
          </div>

          <div style={{ background: 'rgba(255,187,0,0.06)', border: '1px solid rgba(255,187,0,0.15)', borderRadius: '4px', padding: '12px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#ffbb00', lineHeight: 1.7 }}>
            ⚠️ O campo <strong>user_id</strong> é obrigatório em todas as requisições — ele é usado para buscar suas chaves de provider configuradas em Providers de IA.
          </div>
        </div>
      </div>
    </div>
  )
}
