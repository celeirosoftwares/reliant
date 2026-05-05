'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

const DEFAULT_SYSTEM_PROMPT = `You are a data extraction assistant. You MUST respond with ONLY a valid JSON object that strictly follows the provided JSON Schema.

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code blocks
- Every required field must be present
- Data types must match exactly
- If information is not available, use null for optional fields`

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editSchema, setEditSchema] = useState<any>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    definition: '{\n  "type": "object",\n  "required": ["name"],\n  "properties": {\n    "name": { "type": "string" }\n  }\n}',
    safe_fallback: '',
    system_prompt: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  function openCreate() {
    setEditSchema(null)
    setForm({ name: '', slug: '', description: '', definition: '{\n  "type": "object",\n  "required": ["name"],\n  "properties": {\n    "name": { "type": "string" }\n  }\n}', safe_fallback: '', system_prompt: '' })
    setError('')
    setShowModal(true)
  }

  function openEdit(schema: any) {
    setEditSchema(schema)
    setForm({
      name: schema.name || '',
      slug: schema.slug || '',
      description: schema.description || '',
      definition: JSON.stringify(schema.definition, null, 2),
      safe_fallback: schema.safe_fallback ? JSON.stringify(schema.safe_fallback, null, 2) : '',
      system_prompt: schema.system_prompt || '',
    })
    setError('')
    setShowModal(true)
  }

  async function saveSchema() {
    setSaving(true)
    setError('')

    let definition, safe_fallback
    try { definition = JSON.parse(form.definition) } catch { setError('JSON inválido na definição'); setSaving(false); return }
    try { safe_fallback = form.safe_fallback ? JSON.parse(form.safe_fallback) : undefined } catch { setError('JSON inválido no fallback'); setSaving(false); return }

    const body: any = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      definition,
      safe_fallback,
      system_prompt: form.system_prompt || undefined,
    }

    try {
      const method = editSchema ? 'PUT' : 'POST'
      const url = editSchema ? `${apiUrl}/schemas/${editSchema.id}` : `${apiUrl}/schemas`

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
        body: JSON.stringify(body),
      })
      setShowModal(false)
      setSuccess(editSchema ? 'Schema atualizado!' : 'Schema criado!')
      setTimeout(() => setSuccess(''), 3000)
      await loadSchemas(apiKey, apiUrl)
    } catch { setError('Erro ao salvar schema') }
    setSaving(false)
  }

  const inputStyle = { width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }
  const labelStyle = { fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }

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
            <div className={styles.sectionSub}>Defina contratos de output e prompts customizados</div>
          </div>
          <button className={styles.btnPrimary} onClick={openCreate}>+ Novo Schema</button>
        </div>

        {success && (
          <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '4px', padding: '10px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--accent)', marginBottom: '16px' }}>
            {success}
          </div>
        )}

        {loading ? (
          <div className={styles.loading}><div className={styles.spinner}></div> Carregando...</div>
        ) : schemas.length === 0 ? (
          <div className={styles.emptyState}><div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>📋</div>Nenhum schema ainda. Crie seu primeiro schema.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {schemas.map(s => (
              <div key={s.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '20px', transition: 'border-color 0.15s' }}>
                <div style={{ cursor: 'pointer' }} onClick={() => openEdit(s)}>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{s.name}</div>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '8px' }}>{s.slug} · v{s.version}</div>
                  {s.system_prompt && (
                    <div style={{ display: 'inline-flex', padding: '2px 8px', background: 'rgba(68,136,255,0.1)', border: '1px solid rgba(68,136,255,0.2)', borderRadius: '3px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#4488ff', marginBottom: '8px' }}>
                      prompt customizado
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.id}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(s.id) }}
                    style={{ background: 'transparent', border: '1px solid #222', borderRadius: '3px', padding: '3px 8px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    copiar ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', width: '640px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#111', zIndex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                {editSchema ? `Editar Schema — ${editSchema.name}` : 'Criar Schema'}
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Nome</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} style={inputStyle} placeholder="Contact Extraction" />
                </div>
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} placeholder="contact-extraction" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Descrição (opcional)</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Extrai dados de contato de texto livre" />
              </div>

              <div>
                <label style={labelStyle}>Definição JSON Schema</label>
                <textarea value={form.definition} onChange={e => setForm(f => ({ ...f, definition: e.target.value }))} style={{ ...inputStyle, minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }} />
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', marginTop: '4px' }}>JSON Schema draft-7 format</div>
              </div>

              <div>
                <label style={labelStyle}>Safe Fallback (opcional)</label>
                <textarea value={form.safe_fallback} onChange={e => setForm(f => ({ ...f, safe_fallback: e.target.value }))} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', lineHeight: 1.6 }} placeholder='{ "name": null }' />
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', marginTop: '4px' }}>Retornado quando todos os retries falham</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>System Prompt (opcional)</label>
                  <button
                    onClick={() => setForm(f => ({ ...f, system_prompt: f.system_prompt ? '' : DEFAULT_SYSTEM_PROMPT }))}
                    style={{ background: 'none', border: '1px solid #222', borderRadius: '3px', padding: '3px 8px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555', cursor: 'pointer' }}
                  >
                    {form.system_prompt ? 'Limpar' : 'Usar padrão'}
                  </button>
                </div>
                <textarea
                  value={form.system_prompt}
                  onChange={e => setForm(f => ({ ...f, system_prompt: e.target.value }))}
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', lineHeight: 1.6 }}
                  placeholder={`Deixe vazio para usar o prompt padrão do Reliant.\n\nOu personalize:\nYou are a specialized assistant for extracting invoice data...`}
                />
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', marginTop: '4px' }}>
                  Se preenchido, substitui o system prompt padrão do Reliant. O schema JSON será injetado automaticamente.
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '4px', padding: '10px 12px', fontSize: '12px', color: '#ff4455', fontFamily: 'var(--font-ui-mono)' }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end', gap: '8px', position: 'sticky', bottom: 0, background: '#111' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 14px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={saveSchema} disabled={saving} className={styles.btnPrimary}>
                {saving ? 'Salvando...' : editSchema ? 'Salvar alterações' : 'Criar Schema'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
