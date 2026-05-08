'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

const PERIOD_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
  { label: '90 dias', value: 90 },
]

interface Summary {
  total_executions: number
  success_rate: number
  status_breakdown: { success: number; fallback: number; failed: number }
  avg_latency_ms: number
  avg_attempts: number
  total_tokens: number
  estimated_cost_usd: number
  daily: Array<{ date: string; total: number; success: number; tokens: number; cost: number }>
}

interface SchemaStats {
  schema_id: string
  name: string
  slug: string
  total_executions: number
  success_rate: number
  avg_latency_ms: number
  total_tokens: number
  estimated_cost_usd: number
}

interface ProviderStats {
  provider: string
  total_executions: number
  success_rate: number
  avg_latency_ms: number
  avg_attempts: number
  total_tokens: number
  estimated_cost_usd: number
  models_used: string[]
}

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: '#cc785c',
  openai: '#10a37f',
  gemini: '#4285f4',
  groq: '#f55036',
  mistral: '#ff7000',
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(30)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [schemas, setSchemas] = useState<SchemaStats[]>([])
  const [providers, setProviders] = useState<ProviderStats[]>([])
  const [loading, setLoading] = useState(true)
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
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (apiKey) loadData()
  }, [apiKey, period])

  async function loadData() {
    setLoading(true)
    try {
      const headers = { 'X-Reliant-Key': apiKey }
      const [summaryRes, schemasRes, providersRes] = await Promise.all([
        fetch(`${apiUrl}/analytics/summary?days=${period}`, { headers }),
        fetch(`${apiUrl}/analytics/by-schema?days=${period}`, { headers }),
        fetch(`${apiUrl}/analytics/by-provider?days=${period}`, { headers }),
      ])
      const [s, sc, pr] = await Promise.all([summaryRes.json(), schemasRes.json(), providersRes.json()])
      setSummary(s)
      setSchemas(sc.schemas || [])
      setProviders(pr.providers || [])
    } catch {}
    setLoading(false)
  }

  // Build sparkline path from daily data
  function buildSparkline(data: Summary['daily']): string {
    if (!data || data.length === 0) return ''
    const maxVal = Math.max(...data.map(d => d.total), 1)
    const w = 300, h = 60
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - (d.total / maxVal) * h
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }

  const statCard = (label: string, value: string, sub?: string, color?: string) => (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: color || 'var(--text)', letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginTop: '4px' }}>{sub}</div>}
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>analytics</span></div>
        <div className={styles.topbarRight}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                style={{
                  padding: '5px 12px',
                  background: period === opt.value ? 'rgba(0,255,136,0.1)' : 'transparent',
                  border: `1px solid ${period === opt.value ? 'rgba(0,255,136,0.3)' : '#222'}`,
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ui-mono)',
                  fontSize: '11px',
                  color: period === opt.value ? 'var(--accent)' : '#555',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {loading ? (
          <div className={styles.loading}><div className={styles.spinner}></div> Carregando analytics...</div>
        ) : !summary || summary.total_executions === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>📊</div>
            Nenhuma execução nos últimos {period} dias.
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {statCard('Total de execuções', summary.total_executions.toLocaleString())}
              {statCard(
                'Taxa de sucesso',
                `${summary.success_rate}%`,
                `${summary.status_breakdown.fallback} fallbacks · ${summary.status_breakdown.failed} falhas`,
                summary.success_rate >= 95 ? 'var(--accent)' : summary.success_rate >= 80 ? '#ffbb00' : '#ff4444'
              )}
              {statCard('Latência média', `${summary.avg_latency_ms}ms`, `${summary.avg_attempts}x tentativas em média`)}
              {statCard('Custo estimado', `$${summary.estimated_cost_usd.toFixed(4)}`, `${summary.total_tokens.toLocaleString()} tokens`)}
            </div>

            {/* Daily trend chart */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Tendência diária</div>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>Execuções nos últimos {period} dias</div>
                </div>
              </div>
              <div style={{ position: 'relative', height: '80px' }}>
                {summary.daily.length > 0 && (
                  <svg viewBox={`0 0 300 60`} style={{ width: '100%', height: '80px', overflow: 'visible' }} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Fill area */}
                    <path
                      d={`${buildSparkline(summary.daily)} L 300,60 L 0,60 Z`}
                      fill="url(#sparkGrad)"
                    />
                    {/* Line */}
                    <path
                      d={buildSparkline(summary.daily)}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              {/* X axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                {[0, Math.floor(summary.daily.length / 4), Math.floor(summary.daily.length / 2), Math.floor(summary.daily.length * 3 / 4), summary.daily.length - 1].map(i => (
                  <div key={i} style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444' }}>
                    {summary.daily[i]?.date.slice(5)}
                  </div>
                ))}
              </div>
            </div>

            {/* By schema and by provider */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* By schema */}
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Taxa de sucesso por schema</div>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '20px' }}>Top schemas por volume</div>
                {schemas.length === 0 ? (
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#444' }}>Nenhum dado disponível</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {schemas.slice(0, 5).map(s => (
                      <div key={s.schema_id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--text)' }}>{s.name}</div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>{s.total_executions} exec</span>
                            <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', fontWeight: 600, color: s.success_rate >= 95 ? 'var(--accent)' : s.success_rate >= 80 ? '#ffbb00' : '#ff4444' }}>
                              {s.success_rate}%
                            </span>
                          </div>
                        </div>
                        <div style={{ background: '#1a1a1a', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '100px', width: `${s.success_rate}%`, background: s.success_rate >= 95 ? 'var(--accent)' : s.success_rate >= 80 ? '#ffbb00' : '#ff4444', transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', marginTop: '2px' }}>
                          {s.avg_latency_ms}ms · ${s.estimated_cost_usd.toFixed(4)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* By provider */}
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Taxa de sucesso por provider</div>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '20px' }}>Performance por provedor de IA</div>
                {providers.length === 0 ? (
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#444' }}>Nenhum dado disponível</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {providers.map(p => (
                      <div key={p.provider}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PROVIDER_COLORS[p.provider] || '#888', flexShrink: 0 }} />
                            <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--text)', textTransform: 'capitalize' as const }}>{p.provider}</span>
                          </div>
                          <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', fontWeight: 600, color: p.success_rate >= 95 ? 'var(--accent)' : p.success_rate >= 80 ? '#ffbb00' : '#ff4444' }}>
                            {p.success_rate}%
                          </span>
                        </div>
                        <div style={{ background: '#1a1a1a', borderRadius: '100px', height: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                          <div style={{ height: '100%', borderRadius: '100px', width: `${p.success_rate}%`, background: PROVIDER_COLORS[p.provider] || '#888', transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444' }}>
                          {p.total_executions} exec · {p.avg_latency_ms}ms · ${p.estimated_cost_usd.toFixed(4)} · {p.avg_attempts}x tentativas
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
