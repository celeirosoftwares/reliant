// src/app/dashboard/schemas/page.tsx — Schema registry page
'use client'
import { useEffect, useState } from 'react'
import { FileJson2, Plus, Copy, Check } from 'lucide-react'
import { api } from '@/lib/api'

interface Schema {
  id: string; name: string; slug: string; version: number
  description: string | null; definition: object; safe_fallback: object | null
  is_active: boolean; created_at: string
}

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<Schema[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => { loadSchemas() }, [])

  async function loadSchemas() {
    try { setSchemas((await api<{ schemas: Schema[] }>('/schemas')).schemas) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  function copyId(id: string) {
    navigator.clipboard.writeText(id); setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const cardStyle: React.CSSProperties = { background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'16px 20px', display:'flex', alignItems:'center', gap:'16px', transition:'border-color .15s' }
  const badgeStyle: React.CSSProperties = { fontSize:'11px', fontWeight:500, color:'var(--accent)', background:'var(--accent-subtle)', padding:'1px 6px', borderRadius:'4px' }

  return (
    <div className="animate-in" style={{ maxWidth:'900px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700 }}>Schemas</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'13px', marginTop:'2px' }}>Define and version your output contracts</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{ display:'flex', alignItems:'center', gap:'6px', background:'linear-gradient(135deg,var(--accent),#8b5cf6)', color:'white', border:'none', borderRadius:'var(--radius-md)', padding:'9px 16px', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
          <Plus size={15}/> New Schema
        </button>
      </div>

      {showCreate && <CreateForm onDone={() => { setShowCreate(false); loadSchemas() }} />}

      {loading ? <div className="skeleton" style={{ height:'200px', borderRadius:'var(--radius-lg)' }}/> : schemas.length === 0 ? (
        <div style={{ ...cardStyle, justifyContent:'center', flexDirection:'column', padding:'48px', textAlign:'center' }}>
          <FileJson2 size={40} style={{ color:'var(--text-dim)' }}/><p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>No schemas yet</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {schemas.map(s => (
            <div key={s.id} style={cardStyle}>
              <div style={{ width:'38px', height:'38px', background:'var(--accent-subtle)', borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <FileJson2 size={18} style={{ color:'var(--accent)' }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ fontWeight:600, fontSize:'14px' }}>{s.name}</span>
                  <span style={badgeStyle}>v{s.version}</span>
                </div>
                <div style={{ fontSize:'12px', color:'var(--text-dim)', fontFamily:"'JetBrains Mono',monospace", marginTop:'4px' }}>{s.slug}</div>
              </div>
              <button onClick={() => copyId(s.id)} style={{ background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'6px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', color:'var(--text-muted)', fontSize:'11px', fontFamily:"'JetBrains Mono',monospace" }}>
                {copiedId===s.id ? <Check size={12} style={{ color:'var(--success)' }}/> : <Copy size={12}/>}{s.id.slice(0,12)}...
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateForm({ onDone }: { onDone:()=>void }) {
  const [form, setForm] = useState({ name:'', slug:'', description:'', definition:'', fallback:'' })
  const [error, setError] = useState<string|null>(null)
  const [busy, setBusy] = useState(false)
  const iStyle: React.CSSProperties = { width:'100%', background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'9px 12px', color:'var(--text-primary)', fontSize:'13px', outline:'none' }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setBusy(true)
    try {
      const def = JSON.parse(form.definition)
      const fb = form.fallback.trim() ? JSON.parse(form.fallback) : undefined
      await api('/schemas', { method:'POST', body:JSON.stringify({ name:form.name, slug:form.slug, description:form.description||undefined, definition:def, safe_fallback:fb }) })
      onDone()
    } catch(err:any) { setError(err.message) }
    setBusy(false)
  }

  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--accent)', borderRadius:'var(--radius-lg)', padding:'24px', marginBottom:'20px', boxShadow:'var(--shadow-glow)' }}>
      <h3 style={{ fontSize:'15px', fontWeight:600, marginBottom:'16px' }}>Create Schema</h3>
      {error && <div style={{ padding:'8px 12px', background:'var(--danger-subtle)', borderRadius:'var(--radius-sm)', color:'var(--danger)', fontSize:'12px', marginBottom:'12px' }}>{error}</div>}
      <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <div><label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'4px' }}>Name</label><input style={iStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
        <div><label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'4px' }}>Slug</label><input style={iStyle} value={form.slug} onChange={e=>setForm({...form,slug:e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,'')})} required/></div>
        <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'4px' }}>JSON Schema Definition</label><textarea style={{ ...iStyle, fontFamily:"'JetBrains Mono',monospace", minHeight:'120px' }} value={form.definition} onChange={e=>setForm({...form,definition:e.target.value})} required/></div>
        <div style={{ gridColumn:'1/-1', display:'flex', justifyContent:'flex-end' }}>
          <button type="submit" disabled={busy} style={{ background:'linear-gradient(135deg,var(--accent),#8b5cf6)', color:'white', border:'none', borderRadius:'var(--radius-md)', padding:'9px 20px', fontSize:'13px', fontWeight:600, cursor:'pointer', opacity:busy?0.6:1 }}>{busy?'Creating...':'Create Schema'}</button>
        </div>
      </form>
    </div>
  )
}
