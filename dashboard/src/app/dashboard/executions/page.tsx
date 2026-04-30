// src/app/dashboard/executions/page.tsx — Execution logs
'use client'
import { useEffect, useState } from 'react'
import { Play, CheckCircle2, XCircle, AlertTriangle, ChevronRight, Search } from 'lucide-react'
import { api } from '@/lib/api'

interface Execution {
  id: string; schema_name: string | null; schema_slug: string | null; schema_version: number | null
  provider: string; model: string; status: string; attempts: number
  latency_ms: number; tokens_used: number | null; created_at: string
  input_prompt: string; output: any; validation_errors: any; retry_log: any
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  success:  { icon: <CheckCircle2 size={14}/>, color: 'var(--success)', bg: 'var(--success-subtle)', label: 'Success' },
  failed:   { icon: <XCircle size={14}/>, color: 'var(--danger)', bg: 'var(--danger-subtle)', label: 'Failed' },
  fallback: { icon: <AlertTriangle size={14}/>, color: 'var(--warning)', bg: 'var(--warning-subtle)', label: 'Fallback' },
}

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<Execution | null>(null)

  useEffect(() => { load() }, [page, filter])

  async function load() {
    setLoading(true)
    try {
      const qs = filter ? `&status=${filter}` : ''
      const data = await api(`/executions?page=${page}&limit=15${qs}`)
      setExecutions(data.executions); setTotal(data.pagination.total)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const pages = Math.ceil(total / 15)

  return (
    <div className="animate-in" style={{ maxWidth:'1100px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700 }}>Executions</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'13px', marginTop:'2px' }}>{total} total executions</p>
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {['', 'success', 'failed', 'fallback'].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1) }} style={{
              padding:'6px 12px', fontSize:'12px', fontWeight:500, borderRadius:'var(--radius-sm)',
              border: '1px solid var(--border)', cursor:'pointer',
              background: filter===f ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: filter===f ? 'var(--accent)' : 'var(--text-muted)',
            }}>
              {f || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selected && <DetailModal exec={selected} onClose={() => setSelected(null)} />}

      {/* Table */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              {['Status','Schema','Model','Attempts','Latency','Tokens','Time',''].map(h => (
                <th key={h} style={{ padding:'10px 14px', fontSize:'11px', fontWeight:600, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'.5px', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({length:5}).map((_,i) => (
              <tr key={i}><td colSpan={8} style={{ padding:'12px 14px' }}><div className="skeleton" style={{ height:'20px' }}/></td></tr>
            )) : executions.length === 0 ? (
              <tr><td colSpan={8} style={{ padding:'40px', textAlign:'center', color:'var(--text-dim)', fontSize:'13px' }}>No executions found</td></tr>
            ) : executions.map(ex => {
              const sc = statusConfig[ex.status] ?? statusConfig.failed
              const time = new Date(ex.created_at)
              return (
                <tr key={ex.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer', transition:'background .1s' }}
                  onClick={() => setSelected(ex)}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:500, color:sc.color, background:sc.bg, padding:'2px 8px', borderRadius:'4px' }}>{sc.icon}{sc.label}</span>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:'13px', color:'var(--text-secondary)' }}>{ex.schema_name ?? '—'}</td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'var(--text-muted)', fontFamily:"'JetBrains Mono',monospace" }}>{ex.model}</td>
                  <td style={{ padding:'10px 14px', fontSize:'13px', fontWeight:600, color: ex.attempts > 1 ? 'var(--warning)' : 'var(--text-secondary)' }}>{ex.attempts}</td>
                  <td style={{ padding:'10px 14px', fontSize:'13px', color:'var(--text-secondary)' }}>{ex.latency_ms}ms</td>
                  <td style={{ padding:'10px 14px', fontSize:'13px', color:'var(--text-muted)' }}>{ex.tokens_used?.toLocaleString() ?? '—'}</td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'var(--text-dim)' }}>{time.toLocaleTimeString()} {time.toLocaleDateString()}</td>
                  <td style={{ padding:'10px 14px' }}><ChevronRight size={14} style={{ color:'var(--text-dim)' }}/></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginTop:'16px' }}>
          {Array.from({length:Math.min(pages,10)}).map((_,i) => (
            <button key={i} onClick={() => setPage(i+1)} style={{
              width:'32px', height:'32px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)',
              background: page===i+1 ? 'var(--accent)' : 'var(--bg-surface)', color: page===i+1 ? 'white' : 'var(--text-muted)',
              fontSize:'12px', fontWeight:600, cursor:'pointer',
            }}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailModal({ exec, onClose }: { exec: Execution; onClose:()=>void }) {
  const sc = statusConfig[exec.status] ?? statusConfig.failed
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}/>
      <div style={{ position:'relative', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'28px', maxWidth:'700px', width:'100%', maxHeight:'80vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700 }}>Execution Detail</h2>
          <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:500, color:sc.color, background:sc.bg, padding:'3px 10px', borderRadius:'6px' }}>{sc.icon}{sc.label}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'20px' }}>
          {[
            { label:'Model', value:exec.model },
            { label:'Attempts', value:String(exec.attempts) },
            { label:'Latency', value:`${exec.latency_ms}ms` },
            { label:'Tokens', value:exec.tokens_used?.toLocaleString() ?? '—' },
            { label:'Provider', value:exec.provider },
            { label:'Schema', value:exec.schema_name ?? '—' },
          ].map(f => (
            <div key={f.label} style={{ padding:'10px', background:'var(--bg-base)', borderRadius:'var(--radius-md)' }}>
              <div style={{ fontSize:'11px', color:'var(--text-dim)', marginBottom:'2px', textTransform:'uppercase' }}>{f.label}</div>
              <div style={{ fontSize:'13px', fontWeight:600 }}>{f.value}</div>
            </div>
          ))}
        </div>

        <Section title="Input Prompt"><pre style={{ fontSize:'12px', color:'var(--text-secondary)', whiteSpace:'pre-wrap', lineHeight:1.6 }}>{exec.input_prompt}</pre></Section>
        <Section title="Output"><pre style={{ fontSize:'12px', color:'var(--success)', whiteSpace:'pre-wrap', fontFamily:"'JetBrains Mono',monospace" }}>{JSON.stringify(exec.output, null, 2)}</pre></Section>
        {exec.validation_errors && <Section title="Validation Errors"><pre style={{ fontSize:'12px', color:'var(--danger)', whiteSpace:'pre-wrap', fontFamily:"'JetBrains Mono',monospace" }}>{JSON.stringify(exec.validation_errors, null, 2)}</pre></Section>}
        {exec.retry_log && <Section title="Retry Log"><pre style={{ fontSize:'12px', color:'var(--text-muted)', whiteSpace:'pre-wrap', fontFamily:"'JetBrains Mono',monospace" }}>{JSON.stringify(exec.retry_log, null, 2)}</pre></Section>}

        <button onClick={onClose} style={{ marginTop:'16px', padding:'8px 16px', background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', color:'var(--text-muted)', fontSize:'13px', cursor:'pointer' }}>Close</button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text-dim)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'.5px' }}>{title}</div>
      <div style={{ padding:'12px', background:'var(--bg-base)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)', overflow:'auto', maxHeight:'200px' }}>{children}</div>
    </div>
  )
}
