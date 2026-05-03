'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude Sonnet, Opus, Haiku',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'],
    docsUrl: 'https://console.anthropic.com/settings/keys',
    color: '#cc785c',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    docsUrl: 'https://platform.openai.com/api-keys',
    color: '#10a37f',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 1.5 Pro, Flash',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    docsUrl: 'https://aistudio.google.com/app/apikey',
    color: '#4285f4',
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Llama 3, Mixtral — ultra rápido',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
    docsUrl: 'https://console.groq.com/keys',
    color: '#f55036',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral Large, Small',
    models: ['mistral-large-latest', 'mistral-small-latest'],
    docsUrl: 'https://console.mistral.ai/api-keys',
    color: '#ff7000',
  },
]

export default function ProvidersPage() {
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({})
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [keyInput, setKeyInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadSavedKeys()
  }, [])

  async function loadSavedKeys() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from('provider_keys')
      .select('provider')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    const map: Record<string, boolean> = {}
    data?.forEach(k => { map[k.provider] = true })
    setSavedKeys(map)
  }

  async function saveKey() {
    if (!keyInput.trim() || !activeModal) return
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Save to Supabase — key is stored encrypted server-side via RLS + pgcrypto
    const { error } = await supabase
      .from('provider_keys')
      .upsert({
        user_id: session.user.id,
        provider: activeModal,
        encrypted_key: keyInput.trim(),
        label: PROVIDERS.find(p => p.id === activeModal)?.name,
        is_active: true,
      }, { onConflict: 'user_id,provider' })

    if (error) {
      setError('Erro ao salvar a chave. Tente novamente.')
    } else {
      setSuccess('Chave salva com sucesso!')
      setSavedKeys(prev => ({ ...prev, [activeModal]: true }))
      setActiveModal(null)
      setKeyInput('')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  async function deleteKey(provider: string) {
    setDeleting(provider)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase
      .from('provider_keys')
      .delete()
      .eq('user_id', session.user.id)
      .eq('provider', provider)

    setSavedKeys(prev => {
      const next = { ...prev }
      delete next[provider]
      return next
    })
    setDeleting(null)
  }

  const provider = PROVIDERS.find(p => p.id === activeModal)

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>providers</span></div>
        <div className={styles.topbarRight}>
          <div className={styles.statusDot}><span className={styles.dot}></span> API Online</div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Providers de IA</div>
            <div className={styles.sectionSub}>Configure suas chaves de API para cada provedor</div>
          </div>
        </div>

        {success && (
          <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '4px', padding: '12px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '13px', color: 'var(--accent)', marginBottom: '16px' }}>
            {success}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {PROVIDERS.map(p => (
            <div key={p.id} style={{ background: '#111', border: `1px solid ${savedKeys[p.id] ? 'rgba(0,255,136,0.2)' : '#222'}`, borderRadius: '6px', padding: '24px', position: 'relative', transition: 'border-color 0.2s' }}>

              {/* Status badge */}
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                {savedKeys[p.id] ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: 'var(--accent)' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }}></span>
                    Conectado
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', padding: '3px 10px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '100px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555' }}>
                    Não configurado
                  </span>
                )}
              </div>

              {/* Provider info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: p.color + '22', border: `1px solid ${p.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', fontWeight: 600, color: p.color }}>
                  {p.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>{p.description}</div>
                </div>
              </div>

              {/* Models */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                {p.models.map(m => (
                  <span key={m} style={{ padding: '2px 8px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '3px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#555' }}>
                    {m}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setActiveModal(p.id); setKeyInput(''); setError('') }}
                  className={styles.btnPrimary}
                  style={{ fontSize: '11px', padding: '7px 12px' }}
                >
                  {savedKeys[p.id] ? 'Atualizar chave' : '+ Adicionar chave'}
                </button>
                {savedKeys[p.id] && (
                  <button
                    onClick={() => deleteKey(p.id)}
                    disabled={deleting === p.id}
                    style={{ padding: '7px 12px', background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#ff4444', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    {deleting === p.id ? 'Removendo...' : 'Remover'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: '6px', padding: '16px 20px', marginTop: '24px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
          🔒 <strong style={{ color: '#888' }}>Suas chaves são armazenadas de forma segura</strong> no banco de dados com criptografia. Elas nunca são expostas nas respostas da API nem nos logs do dashboard.
        </div>
      </div>

      {/* Modal */}
      {activeModal && provider && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', width: '480px', maxWidth: '90vw' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                Configurar {provider.name}
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  API Key
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder={`Cole sua ${provider.name} API key aqui`}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '10px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && saveKey()}
                  autoFocus
                />
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', marginTop: '6px' }}>
                  Gere sua chave em:{' '}
                  <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                    {provider.docsUrl.replace('https://', '')}
                  </a>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '4px', padding: '10px 12px', fontSize: '12px', color: '#ff4455', fontFamily: 'var(--font-ui-mono)' }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setActiveModal(null)} style={{ padding: '8px 14px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button
                onClick={saveKey}
                disabled={saving || !keyInput.trim()}
                className={styles.btnPrimary}
                style={{ opacity: !keyInput.trim() ? 0.5 : 1 }}
              >
                {saving ? 'Salvando...' : 'Salvar chave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
