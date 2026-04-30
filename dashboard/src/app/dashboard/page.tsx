// src/app/dashboard/page.tsx — Overview page with metrics
'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle2, XCircle, AlertTriangle, Clock, Cpu, Zap } from 'lucide-react'
import { api } from '@/lib/api'

interface Summary {
  period_days: number
  total_executions: number
  success_rate: number
  status_breakdown: { success: number; failed: number; fallback: number }
  avg_latency_ms: number
  avg_attempts: number
  total_tokens: number
  daily: Array<{ date: string; total: number; success: number; failed: number; tokens: number }>
}

export default function OverviewPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    api<Summary>(`/metrics/summary?days=${days}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [days])

  if (loading) return <LoadingSkeleton />

  const stats = data!

  return (
    <div className="animate-in" style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>Performance metrics for your project</p>
        </div>
        <select
          value={days}
          onChange={(e) => { setDays(Number(e.target.value)); setLoading(true) }}
          style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <MetricCard icon={<Activity size={18} />} label="Total Executions" value={stats.total_executions.toLocaleString()} color="var(--accent)" />
        <MetricCard icon={<CheckCircle2 size={18} />} label="Success Rate" value={`${stats.success_rate}%`} color="var(--success)" />
        <MetricCard icon={<Clock size={18} />} label="Avg Latency" value={`${stats.avg_latency_ms}ms`} color="var(--info)" />
        <MetricCard icon={<Cpu size={18} />} label="Tokens Used" value={stats.total_tokens.toLocaleString()} color="var(--warning)" />
      </div>

      {/* Status breakdown + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '24px' }}>
        {/* Breakdown */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Status Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <StatusRow icon={<CheckCircle2 size={14} />} label="Success" value={stats.status_breakdown.success} total={stats.total_executions} color="var(--success)" />
            <StatusRow icon={<XCircle size={14} />} label="Failed" value={stats.status_breakdown.failed} total={stats.total_executions} color="var(--danger)" />
            <StatusRow icon={<AlertTriangle size={14} />} label="Fallback" value={stats.status_breakdown.fallback} total={stats.total_executions} color="var(--warning)" />
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Zap size={12} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>AVG ATTEMPTS</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.avg_attempts}</div>
          </div>
        </div>

        {/* Daily chart (simple bar chart) */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Daily Executions</h3>
          {stats.daily.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: 'var(--text-dim)', fontSize: '13px' }}>
              No data yet. Start executing to see charts.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '180px', paddingTop: '8px' }}>
              {stats.daily.slice(-30).map((d, i) => {
                const max = Math.max(...stats.daily.map((x) => x.total), 1)
                const h = Math.max((d.total / max) * 160, 4)
                const successH = d.total > 0 ? (d.success / d.total) * h : 0
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', position: 'relative' }} title={`${d.date}: ${d.total} executions`}>
                    <div style={{ width: '100%', borderRadius: '3px 3px 0 0', overflow: 'hidden' }}>
                      <div style={{ height: `${h}px`, background: 'var(--danger-subtle)', borderRadius: '3px 3px 0 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${successH}px`, background: 'var(--accent)', borderRadius: i === 0 ? '3px 0 0 0' : i === stats.daily.length - 1 ? '0 3px 0 0' : '0', opacity: 0.8 }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '2px', opacity: 0.8 }} /> Success
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--danger-subtle)', borderRadius: '2px' }} /> Failed
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px', transition: 'border-color 0.15s' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ color, opacity: 0.8 }}>{icon}</div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
      </div>
      <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  )
}

function StatusRow({ icon, label, value, total, color }: { icon: React.ReactNode; label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color, fontSize: '13px', fontWeight: 500 }}>
          {icon} {label}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: '4px', background: 'var(--bg-base)', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '100px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: '1100px' }}>
      <div className="skeleton" style={{ width: '200px', height: '28px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '300px', height: '16px', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    </div>
  )
}
