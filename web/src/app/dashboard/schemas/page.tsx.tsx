'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', definition: '{\n  "type": "object",\n  "required": ["name"],\n  "properties": {\n    "name": { "type": "string" }\n  }\n}', fallback: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

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
        await loadSchemas(profile.reliant_api_key, profile.reliant_api_url)
      }
    }
    init()
  }, [])

  async function loadSchemas(key: string, url: string) {
    setLoading(true)
    try {
      const res = await fetch(`${url}/schemas`, { headers: { 'X-Reliant-Key': key } })
      const data = await res.json()
      setSchemas(data.schemas || [])
    } catch {}
    setLoading(false)
  }

  async function createSchema() {
    setCreating(true)
    setError('')
    let definition, safe_fallback
    try { definition = JSON.parse(form.definition) } catch { setError('JSON inválido na definição'); setCreating(false); return }
    try { safe_fallback = form.fallback ? JSON.parse(form.fallback) : undefined } catch { setError('JSON inválido no fallback'); setCreating(false); return }
    try {
      await fetch(`${apiUrl}/schemas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
        body: JSON.stringify({ name: form.name, slug: form.slug, definition, safe_fallback }),
      })
      setShowModal(false)
      setForm({ name: '', slug: '', definition: '{\n  "type": "object",\n  "required": ["name"],\n  "properties": {\n    "name": { "type": "string" }\n  }\n}', fallback: '' })
      await loadSchemas(apiKey, apiUrl)
    } catch { setError('Erro ao criar schema') }
    setCreating(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>schemas</span></div>
        <div className={styles.topbarRight}>
          <div className={styles.statusDot}><span className={styles.dot}></span> API Online</div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Schemas</div>
            <div className={styles.sectionSub}>Defina e versione seus contratos de output</div>
          </div>
          <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>+ Novo Schema</button>
        </div>

        {loading ? (
          <div className={styles.loading}><div className={styles.spinner}></div> Carregando...</div>
        ) : schemas.length === 0 ? (
          <div className={styles.emptyState}>Nenhum schema ainda. Crie seu primeiro schema.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {schemas.map(s => (
              <div key={s.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '8px' }}>{s.slug} · v{s.version}</div>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>ID: {s.id.substring(0, 12)}...</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', width: '560px', maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600 }}>Criar Schema</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Nome</label>
                <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })) }} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }} placeholder="Contact Extraction" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }} placeholder="contact-extraction" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Definição JSON Schema</label>
                <textarea value={form.definition} onChange={e => setForm(f => ({ ...f, definition: e.target.value }))} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none', minHeight: '140px', resize: 'vertical' }} />
              </div>
              {error && <div style={{ background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', color: '#ff4455', fontFamily: 'var(--font-ui-mono)' }}>{error}</div>}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 14px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={createSchema} disabled={creating} style={{ padding: '8px 14px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{creating ? 'Criando...' : 'Criar Schema'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
