'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

const EVENTS = [
  { id: 'execution.failed', label: 'Execução falhou', desc: 'Todos os retries falharam' },
  { id: 'execution.fallback', label: 'Fallback usado', desc: 'Provider de fallback foi acionado' },
  { id: 'execution.success', label: 'Execução bem-sucedida', desc: 'Output validado com sucesso' },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [userId, setUserId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editWebhook, setEditWebhook] = useState<any>(null)
  const [form, setForm] = useState({ name: '', url: '', secret: '', events: ['execution.failed', 'execution.fallback'] })
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const supabase = createClient()
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUserId(session.user.id)
      const { data: profile } = await supabase
        .from('profiles')
        .select('reliant_api_key, reliant_api_url')
        .eq('id', session.user.id)
        .single()
      if (profile?.reliant_api_key) {
        setApiKey(profile.reliant_api_key)
        const url = profile.reliant_api_url || 'https://reliant-production.up.railway.app'
        setApiUrl(url)
        await loadWebhooks(profile.reliant_api_key, url, session.user.id)
      } else {
        setLoading(false)
      }
    }
    init()
  }, [])

  async function loadWebhooks(key: string, url: string, uid: string) {
    setLoading(true)
    try {
      const res = await fetch(`${url}/webhooks?user_id=${uid}`, { headers: { 'X-Reliant-Key': key } })
      const data = await res.json()
      setWebhooks(data.webhooks || [])
    } catch {}
    setLoading(false)
  }

  function openCreate() {
    setEditWebhook(null)
    setForm({ name: '', url: '', secret: '', events: ['execution.failed', 'execution.fallback'] })
    setError('')
    setTestResult(null)
    setShowModal(true)
  }

  function openEdit(webhook: any) {
    setEditWebhook(webhook)
    setForm({ name: webhook.name, url: webhook.url, secret: '', events: webhook.events || [] })
    setError('')
    setTestResult(null)
    setShowModal(true)
  }

  function toggleEvent(eventId: string) {
    setForm(f => ({
      ...f,
      events: f.events.includes(eventId) ? f.events.filter(e => e !== eventId) : [...f.events, eventId]
    }))
  }

  async function saveWebhook() {
    setSaving(true)
    setError('')
    if (!form.name || !form.url) { setError('Nome e URL são obrigatórios'); setSaving(false); return }
    if (form.events.length === 0) { setError('Selecione ao menos um evento'); setSaving(false); return }

    try {
      const method = editWebhook ? 'PUT' : 'POST'
      const url = editWebhook ? `${apiUrl}/webhooks/${editWebhook.id}` : `${apiUrl}/webhooks`
      const body: any = { name: form.name, url: form.url, events: form.events, user_id: userId }
      if (form.secret) body.secret = form.secret

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao salvar webhook')
        setSaving(false)
        return
      }

      setShowModal(false)
      setSuccess(editWebhook ? 'Webhook atualizado!' : 'Webhook criado!')
      setTimeout(() => setSuccess(''), 3000)
      await loadWebhooks(apiKey, apiUrl, userId)
    } catch { setError('Erro de conexão') }
    setSaving(false)
  }

  async function deleteWebhook(id: string) {
    if (!confirm('Deletar este webhook?')) return
    await fetch(`${apiUrl}/webhooks/${id}`, { method: 'DELETE', headers: { 'X-Reliant-Key': apiKey } })
    await loadWebhooks(apiKey, apiUrl, userId)
  }

  async function toggleActive(webhook: any) {
    await fetch(`${apiUrl}/webhooks/${webhook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
      body: JSON.stringify({ is_active: !webhook.is_active }),
    })
    await loadWebhooks(apiKey, apiUrl, userId)
  }

  async function testWebhook(id: string) {
    setTesting(id)
    setTestResult(null)
    try {
      const res = await fetch(`${apiUrl}/webhooks/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
      })
      const data = await res.json()
      setTestResult(data)
    } catch { setTestResult({ success: false, error: 'Erro de conexão' }) }
    setTesting(null)
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>webhooks</span></div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Webhooks</div>
            <div className={styles.sectionSub}>Receba notificações quando execuções falharem ou usarem fallback</div>
          </div>
          <button className={styles.btnPrimary} onClick={openCreate}>+ Novo Webhook</button>
        </div>

        {success && (
          <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '4px', padding: '10px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--accent)', marginBottom: '16px' }}>
            {success}
          </div>
        )}

        {/* Payload example */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Payload enviado</div>
          <pre style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#666', lineHeight: 1.8, margin: 0 }}>{`{
  "event": "execution.failed",
  "execution_id": "exec_...",
  "schema_id": "sch_...",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "attempts": 3,
  "latency_ms": 4521,
  "status": "FAILED",
  "timestamp": "2026-05-17T12:00:00Z"
}`}</pre>
        </div>

        {loading ? (
          <div className={styles.loading}><div className={styles.spinner}></div> Carregando...</div>
        ) : webhooks.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>🔔</div>
            Nenhum webhook configurado. Crie um para receber alertas.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {webhooks.map(w => (
              <div key={w.id} style={{ background: '#111', border: `1px solid ${w.is_active ? '#222' : '#1a1a1a'}`, borderRadius: '6px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', opacity: w.is_active ? 1 : 0.6 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{w.name}</div>
                    {!w.is_active && <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555', background: '#1a1a1a', border: '1px solid #222', borderRadius: '3px', padding: '1px 6px' }}>inativo</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.url}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                    {(w.events || []).map((e: string) => (
                      <span key={e} style={{ display: 'inline-flex', padding: '2px 8px', background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '3px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#888' }}>{e}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => testWebhook(w.id)}
                    disabled={testing === w.id}
                    style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', cursor: 'pointer' }}
                  >
                    {testing === w.id ? 'Testando...' : 'Testar'}
                  </button>
                  <button onClick={() => toggleActive(w)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', cursor: 'pointer' }}>
                    {w.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button onClick={() => openEdit(w)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => deleteWebhook(w.id)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#ff4455', cursor: 'pointer' }}>Deletar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {testResult && (
          <div style={{ marginTop: '16px', background: testResult.success ? 'rgba(0,255,136,0.06)' : 'rgba(255,68,85,0.06)', border: `1px solid ${testResult.success ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,85,0.2)'}`, borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: testResult.success ? 'var(--accent)' : '#ff4455', marginBottom: '8px' }}>
              {testResult.success ? `✅ Webhook entregue — HTTP ${testResult.status_code}` : `❌ Falha na entrega — ${testResult.error || 'Erro desconhecido'}`}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', width: '560px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#111', zIndex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                {editWebhook ? 'Editar Webhook' : 'Novo Webhook'}
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Slack — Alertas de falha" />
              </div>

              <div>
                <label style={labelStyle}>URL do Endpoint</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} style={inputStyle} placeholder="https://hooks.slack.com/services/..." />
              </div>

              <div>
                <label style={labelStyle}>Secret (opcional)</label>
                <input value={form.secret} onChange={e => setForm(f => ({ ...f, secret: e.target.value }))} style={inputStyle} placeholder="Para verificar assinatura HMAC-SHA256" type="password" />
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', marginTop: '4px' }}>
                  Se preenchido, o header <code>X-Reliant-Signature</code> será enviado com cada request.
                </div>
              </div>

              <div>
                <label style={labelStyle}>Eventos</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {EVENTS.map(event => (
                    <div
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: form.events.includes(event.id) ? 'rgba(0,255,136,0.06)' : '#1a1a1a', border: `1px solid ${form.events.includes(event.id) ? 'rgba(0,255,136,0.2)' : '#222'}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <div style={{ width: '16px', height: '16px', border: `1px solid ${form.events.includes(event.id) ? 'var(--accent)' : '#444'}`, borderRadius: '3px', background: form.events.includes(event.id) ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {form.events.includes(event.id) && <span style={{ color: '#000', fontSize: '10px', fontWeight: 900 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--text)' }}>{event.label}</div>
                        <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555' }}>{event.desc}</div>
                      </div>
                    </div>
                  ))}
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
              <button onClick={saveWebhook} disabled={saving} className={styles.btnPrimary}>
                {saving ? 'Salvando...' : editWebhook ? 'Salvar alterações' : 'Criar Webhook'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
