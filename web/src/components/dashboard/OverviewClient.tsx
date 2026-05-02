'use client'

import { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'

interface Props {
  apiKey: string
  apiUrl: string
  plan: string
}

export default function OverviewClient({ apiKey, apiUrl, plan }: Props) {
  const [metrics, setMetrics] = useState<any>(null)
  const [executions, setExecutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  async function fetchData(d: number) {
    setLoading(true)
    try {
      const [metricsRes, execRes] = await Promise.all([
        fetch(`${apiUrl}/metrics/summary?days=${d}`, { headers: { 'X-Reliant-Key': apiKey } }),
        fetch(`${apiUrl}/executions?limit=8`, { headers: { 'X-Reliant-Key': apiKey } }),
      ])
      const m = await metricsRes.json()
      const e = await execRes.json()
      setMetrics(m)
      setExecutions(e.executions || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchData(days) }, [days])

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'agora'
    if (m < 60) return `${m}min atrás`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h atrás`
    return `${Math.floor(h / 24)}d atrás`
  }

  const maxBar = Math.max(...(metrics?.daily || []).map((d: any) => d.total), 1)

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>visão geral</span></div>
        <div className={styles.topbarRight}>
          <div className={styles.statusDot}><span className={styles.dot}></span> API Online</div>
          <div className={styles.periodBtns}>
            {[7, 30, 90].map(d => (
              <button
                key={d}
                className={`${styles.periodBtn} ${days === d ? styles.active : ''}`}
                onClick={() => setDays(d)}
              >{d}d</button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Visão Geral</div>
            <div className={styles.sectionSub}>
              {loading ? 'Carregando...' : `Últimos ${days} dias · ${metrics?.total_executions || 0} execuções`}
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statLabel}>Total de Execuções</div>
            <div className={styles.statValue}>{loading ? '—' : metrics?.total_executions ?? 0}</div>
            <div className={styles.statSub}>últimos {days} dias</div>
          </div>
          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statLabel}>Taxa de Sucesso</div>
            <div className={`${styles.statValue} ${styles.accentText}`}>{loading ? '—' : `${metrics?.success_rate ?? 0}%`}</div>
            <div className={styles.statSub}>{metrics?.status_breakdown?.success ?? 0} com sucesso</div>
          </div>
          <div className={`${styles.statCard} ${styles.blue}`}>
            <div className={styles.statLabel}>Latência Média</div>
            <div className={styles.statValue}>{loading ? '—' : metrics?.avg_latency_ms ?? 0}</div>
            <div className={styles.statSub}>milissegundos</div>
          </div>
          <div className={`${styles.statCard} ${styles.yellow}`}>
            <div className={styles.statLabel}>Total de Tokens</div>
            <div className={styles.statValue}>{loading ? '—' : (metrics?.total_tokens ?? 0).toLocaleString()}</div>
            <div className={styles.statSub}>{metrics?.avg_attempts ?? 0} tentativas em média</div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Execuções ao longo do tempo</div>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'var(--accent)' }}></div>Sucesso</div>
              <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: '#ff4444' }}></div>Falha</div>
            </div>
          </div>
          <div className={styles.barChart}>
            {loading ? (
              <div className={styles.loading}><div className={styles.spinner}></div> Carregando...</div>
            ) : (metrics?.daily || []).slice(-20).map((d: any) => (
              <div key={d.date} className={styles.barGroup}>
                <div className={styles.barWrap}>
                  <div className={styles.barSuccess} style={{ height: `${Math.max(2, (d.success / maxBar) * 96)}px` }}></div>
                  <div className={styles.barFailed} style={{ height: `${Math.max(d.failed > 0 ? 2 : 0, (d.failed / maxBar) * 96)}px` }}></div>
                </div>
                <div className={styles.barLabel}>{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>Execuções Recentes</div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Schema</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Latency</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div className={styles.loading}><div className={styles.spinner}></div></div></td></tr>
              ) : executions.length === 0 ? (
                <tr><td colSpan={6}><div className={styles.emptyState}>Nenhuma execução ainda</div></td></tr>
              ) : executions.map(e => (
                <tr key={e.id}>
                  <td className={styles.mono}>{e.id.substring(0, 16)}...</td>
                  <td className={styles.mono}>{e.schema_id ? e.schema_id.substring(0, 12) + '...' : '—'}</td>
                  <td><span className={`${styles.badge} ${styles[e.status]}`}>{e.status}</span></td>
                  <td className={styles.mono}>{e.attempts}</td>
                  <td className={styles.mono}>{e.latency_ms}ms</td>
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
