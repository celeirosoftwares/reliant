'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')

  useEffect(() => {
    const supabase = createClient()
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('reliant_api_key, reliant_api_url')
        .eq('id', session.user.id)
        .single()
      if (profile?.reliant_api_key) {
        setApiKey(profile.reliant_api_key)
        setApiUrl(profile.reliant_api_url || 'https://reliant-production.up.railway.app')
        await loadExecutions(profile.reliant_api_key, profile.reliant_api_url)
      }
    }
    init()
  }, [])

  async function loadExecutions(key: string, url: string) {
    setLoading(true)
    try {
      const res = await fetch(`${url}/executions?limit=50`, {
        headers: { 'X-Reliant-Key': key }
      })
      const data = await res.json()
      setExecutions(data.executions || [])
    } catch {}
    setLoading(false)
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'agora'
    if (m < 60) return `${m}min atrás`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h atrás`
    return `${Math.floor(h / 24)}d atrás`
  }

  const filtered = filter === 'all' ? executions : executions.filter(e => e.status === filter)

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>execuções</span></div>
        <div className={styles.topbarRight}>
          <div className={styles.statusDot}><span className={styles.dot}></span> API Online</div>
          <button className={styles.btnGhost} onClick={() => loadExecutions(apiKey, apiUrl)}>↻ Atualizar</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Execuções</div>
            <div className={styles.sectionSub}>Log completo com detalhes de input/output</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['all', 'success', 'failed', 'fallback'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: `1px solid ${filter === f ? 'var(--accent)' : '#222'}`,
                borderRadius: '4px',
                fontFamily: 'var(--font-ui-mono)',
                fontSize: '11px',
                color: filter === f ? 'var(--accent)' : '#555',
                cursor: 'pointer',
                background: filter === f ? 'rgba(0,255,136,0.06)' : 'transparent',
              }}
            >
              {f === 'all' ? 'Todos' : f === 'success' ? 'Sucesso' : f === 'failed' ? 'Falha' : 'Fallback'}
            </button>
          ))}
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Schema</th>
                <th>Provider / Model</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Latency</th>
                <th>Tokens</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className={styles.loading}><div className={styles.spinner}></div></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className={styles.emptyState}>Nenhuma execução encontrada</div></td></tr>
              ) : filtered.map(e => (
                <tr key={e.id}>
                  <td className={styles.mono}>{e.id.substring(0, 20)}...</td>
                  <td className={styles.mono}>{e.schema_id ? e.schema_id.substring(0, 14) + '...' : '—'}</td>
                  <td className={styles.mono}>{e.provider} / {e.model?.split('-').slice(0, 2).join('-')}</td>
                  <td><span className={`${styles.badge} ${styles[e.status]}`}>{e.status}</span></td>
                  <td className={styles.mono}>{e.attempts}</td>
                  <td className={styles.mono}>{e.latency_ms}ms</td>
                  <td className={styles.mono}>{e.tokens_used ?? '—'}</td>
                  <td className={styles.mono}>{timeAgo(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
