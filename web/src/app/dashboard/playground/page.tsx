'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

const PROVIDERS = [
  { id: 'anthropic', name: 'Anthropic', models: ['claude-sonnet-4-20250514', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'] },
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
  { id: 'gemini', name: 'Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash'] },
  { id: 'groq', name: 'Groq', models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'] },
  { id: 'mistral', name: 'Mistral', models: ['mistral-large-latest', 'mistral-small-latest'] },
]

const MODEL_COSTS: Record<string, number> = {
  'claude-sonnet-4-20250514': 6.0, 'claude-opus-4-5': 30.0, 'claude-haiku-4-5-20251001': 1.0,
  'gpt-4o': 7.5, 'gpt-4o-mini': 0.3, 'gpt-4-turbo': 15.0,
  'gemini-1.5-pro': 3.5, 'gemini-1.5-flash': 0.15,
  'llama-3.3-70b-versatile': 0.8, 'mixtral-8x7b-32768': 0.5,
  'mistral-large-latest': 6.0, 'mistral-small-latest': 1.0,
}

const TEMPLATES = [
  {
    category: 'Extração de Dados',
    items: [
      {
        name: 'Extração de Contato',
        slug: 'contact-extraction',
        description: 'Extrai nome, email e telefone de texto livre',
        prompt: 'Extraia os dados de contato do seguinte texto:\n\nOlá, meu nome é João Silva, pode me contatar pelo email joao.silva@empresa.com ou pelo telefone (11) 99999-8888.',
        definition: { type: 'object', required: ['name', 'email'], properties: { name: { type: 'string', description: 'Nome completo' }, email: { type: 'string', format: 'email' }, phone: { type: 'string', description: 'Telefone com DDD' } } },
        safe_fallback: { name: null, email: null, phone: null },
      },
      {
        name: 'Extração de Empresa',
        slug: 'company-extraction',
        description: 'Extrai dados de empresa de texto livre',
        prompt: 'Extraia os dados da empresa:\n\nA Acme Construções LTDA, com CNPJ 12.345.678/0001-90, atua no setor de construção civil e está localizada na Rua das Flores, 123, São Paulo - SP.',
        definition: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, cnpj: { type: 'string' }, sector: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' } } },
        safe_fallback: { name: null, cnpj: null, sector: null, city: null, state: null },
      },
      {
        name: 'Extração de Endereço',
        slug: 'address-extraction',
        description: 'Estrutura um endereço a partir de texto',
        prompt: 'Extraia o endereço:\n\nRua das Palmeiras, 456, Apto 12, Jardim América, São Paulo - SP, CEP 01234-567.',
        definition: { type: 'object', required: ['street'], properties: { street: { type: 'string' }, number: { type: 'string' }, complement: { type: 'string' }, neighborhood: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' }, zip_code: { type: 'string' } } },
        safe_fallback: { street: null, number: null, complement: null, neighborhood: null, city: null, state: null, zip_code: null },
      },
    ],
  },
  {
    category: 'Classificação',
    items: [
      {
        name: 'Análise de Sentimento',
        slug: 'sentiment-analysis',
        description: 'Classifica sentimento e confiança de um texto',
        prompt: 'Analise o sentimento do seguinte comentário:\n\n"O produto chegou muito rápido e a qualidade superou minhas expectativas. Recomendo!"',
        definition: { type: 'object', required: ['sentiment', 'confidence'], properties: { sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] }, confidence: { type: 'number', minimum: 0, maximum: 1 }, summary: { type: 'string' } } },
        safe_fallback: { sentiment: 'neutral', confidence: 0, summary: null },
      },
      {
        name: 'Prioridade de Ticket',
        slug: 'ticket-priority',
        description: 'Classifica a prioridade e categoria de um ticket de suporte',
        prompt: 'Classifique este ticket de suporte:\n\n"Nosso sistema caiu e todos os funcionários estão sem acesso. Temos uma apresentação para cliente em 2 horas!"',
        definition: { type: 'object', required: ['priority', 'category'], properties: { priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }, category: { type: 'string', enum: ['technical', 'financial', 'commercial', 'other'] }, summary: { type: 'string' }, estimated_resolution: { type: 'string' } } },
        safe_fallback: { priority: 'medium', category: 'other', summary: null, estimated_resolution: null },
      },
    ],
  },
  {
    category: 'Fitness & Saúde',
    items: [
      {
        name: 'Treino Estruturado',
        slug: 'workout-plan',
        description: 'Gera um treino estruturado com exercícios e séries',
        prompt: 'Monte um treino de musculação para iniciante focado em peito e tríceps, com duração de 45 minutos, usando apenas equipamentos de academia.',
        definition: { type: 'object', required: ['name', 'exercises'], properties: { name: { type: 'string' }, focus: { type: 'string' }, duration_minutes: { type: 'number' }, exercises: { type: 'array', items: { type: 'object', required: ['name', 'sets', 'reps'], properties: { name: { type: 'string' }, sets: { type: 'number' }, reps: { type: 'string' }, rest_seconds: { type: 'number' }, notes: { type: 'string' } } } } } },
        safe_fallback: { name: null, focus: null, duration_minutes: null, exercises: [] },
      },
    ],
  },
  {
    category: 'Construção & Imóveis',
    items: [
      {
        name: 'Extração de Proposta',
        slug: 'proposal-extraction',
        description: 'Extrai dados estruturados de uma proposta comercial',
        prompt: 'Extraia os dados da proposta:\n\nProposta de reforma completa do apartamento 42m², incluindo pintura, piso e elétrica. Valor total: R$ 28.500,00. Prazo de execução: 45 dias corridos. Validade da proposta: 15 dias.',
        definition: { type: 'object', required: ['total_value'], properties: { service_description: { type: 'string' }, total_value: { type: 'number' }, currency: { type: 'string', enum: ['BRL', 'USD', 'EUR'] }, deadline_days: { type: 'number' }, validity_days: { type: 'number' }, includes: { type: 'array', items: { type: 'string' } } } },
        safe_fallback: { service_description: null, total_value: null, currency: 'BRL', deadline_days: null, validity_days: null, includes: [] },
      },
    ],
  },
  {
    category: 'Documentos',
    items: [
      {
        name: 'Resumo de Reunião',
        slug: 'meeting-summary',
        description: 'Estrutura o resumo de uma reunião com decisões e próximos passos',
        prompt: 'Resuma a seguinte ata de reunião:\n\nReunião de alinhamento do projeto XYZ. Presentes: João (PM), Maria (Dev), Carlos (Design). Decidido: lançar MVP em 60 dias, priorizar mobile first. João ficará responsável pelo backlog, Maria pela arquitetura técnica e Carlos pelos wireframes. Próxima reunião: sexta-feira.',
        definition: { type: 'object', required: ['summary'], properties: { summary: { type: 'string' }, decisions: { type: 'array', items: { type: 'string' } }, action_items: { type: 'array', items: { type: 'object', properties: { responsible: { type: 'string' }, task: { type: 'string' } } } }, next_meeting: { type: 'string' } } },
        safe_fallback: { summary: null, decisions: [], action_items: [], next_meeting: null },
      },
      {
        name: 'Extração de Contrato',
        slug: 'contract-extraction',
        description: 'Extrai as principais cláusulas e dados de um contrato',
        prompt: 'Extraia os dados do contrato:\n\nContrato de prestação de serviços entre Acme Tech LTDA (contratante) e João Silva ME (contratado), pelo valor mensal de R$ 5.000,00, com vigência de 12 meses a partir de 01/06/2026, com renovação automática.',
        definition: { type: 'object', required: ['contractor', 'contracted'], properties: { contractor: { type: 'string' }, contracted: { type: 'string' }, monthly_value: { type: 'number' }, duration_months: { type: 'number' }, start_date: { type: 'string' }, auto_renewal: { type: 'boolean' } } },
        safe_fallback: { contractor: null, contracted: null, monthly_value: null, duration_months: null, start_date: null, auto_renewal: false },
      },
    ],
  },
]

export default function PlaygroundPage() {
  const [tab, setTab] = useState<'playground' | 'templates'>('playground')
  const [schemas, setSchemas] = useState<any[]>([])
  const [selectedSchemaId, setSelectedSchemaId] = useState('')
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-sonnet-4-20250514')
  const [prompt, setPrompt] = useState('')
  const [maxRetries, setMaxRetries] = useState(3)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [userId, setUserId] = useState('')
  const [importingTemplate, setImportingTemplate] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

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
        const res = await fetch(`${url}/schemas`, { headers: { 'X-Reliant-Key': profile.reliant_api_key } })
        const data = await res.json()
        setSchemas(data.schemas || [])
        if (data.schemas?.length > 0) setSelectedSchemaId(data.schemas[0].id)
      }
    }
    init()
  }, [])

  const selectedProvider = PROVIDERS.find(p => p.id === provider)

  async function runExecution() {
    if (!prompt.trim() || !selectedSchemaId) {
      setError('Preencha o prompt e selecione um schema.')
      return
    }
    setRunning(true)
    setResult(null)
    setError('')

    try {
      const res = await fetch(`${apiUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
        body: JSON.stringify({
          prompt,
          schema_id: selectedSchemaId,
          provider,
          model,
          user_id: userId,
          options: { max_retries: maxRetries },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Erro na execução')
      } else {
        setResult(data)
      }
    } catch {
      setError('Erro ao conectar com a API')
    }
    setRunning(false)
  }

  async function importTemplate(template: any) {
    setImportingTemplate(template.slug)
    try {
      const res = await fetch(`${apiUrl}/schemas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Reliant-Key': apiKey },
        body: JSON.stringify({
          name: template.name,
          slug: template.slug,
          description: template.description,
          definition: template.definition,
          safe_fallback: template.safe_fallback,
        }),
      })
      if (res.ok) {
        const schema = await res.json()
        setSchemas(prev => [...prev, schema])
        setImportSuccess(template.name)
        setTimeout(() => setImportSuccess(null), 3000)
      } else {
        const data = await res.json()
        // If slug already exists, just show success
        if (data.message?.includes('slug')) {
          setImportSuccess(template.name + ' (já existe)')
          setTimeout(() => setImportSuccess(null), 3000)
        }
      }
    } catch {}
    setImportingTemplate(null)
  }

  function estimateCost(tokens: number, modelId: string) {
    const costPer1M = MODEL_COSTS[modelId] ?? 5.0
    return ((tokens / 1_000_000) * costPer1M).toFixed(6)
  }

  const inputStyle: React.CSSProperties = { background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', outline: 'none', width: '100%' }
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>{tab === 'playground' ? 'playground' : 'templates'}</span></div>
        <div className={styles.topbarRight}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['playground', 'templates'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '5px 14px', background: tab === t ? 'rgba(0,255,136,0.1)' : 'transparent', border: `1px solid ${tab === t ? 'rgba(0,255,136,0.3)' : '#222'}`, borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: tab === t ? 'var(--accent)' : '#555', cursor: 'pointer' }}>
                {t === 'playground' ? '⚡ Playground' : '📋 Templates'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {/* PLAYGROUND TAB */}
        {tab === 'playground' && (
          <>
            <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: '4px', padding: '10px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginBottom: '24px' }}>
              ⚡ Cada execução no Playground conta para sua cota mensal. As chaves dos providers são as que você configurou em <a href="/dashboard/providers" style={{ color: 'var(--accent)' }}>Providers de IA</a>.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left — Config */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Schema</label>
                  {schemas.length === 0 ? (
                    <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '4px', padding: '10px 12px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555' }}>
                      Nenhum schema. <a href="/dashboard/schemas" style={{ color: 'var(--accent)' }}>Criar schema</a> ou <button onClick={() => setTab('templates')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', padding: 0 }}>usar um template</button>.
                    </div>
                  ) : (
                    <select value={selectedSchemaId} onChange={e => setSelectedSchemaId(e.target.value)} style={{ ...inputStyle }}>
                      {schemas.map(s => <option key={s.id} value={s.id}>{s.name} · v{s.version}</option>)}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Provider</label>
                    <select value={provider} onChange={e => { setProvider(e.target.value); setModel(PROVIDERS.find(p => p.id === e.target.value)?.models[0] || '') }} style={{ ...inputStyle }}>
                      {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Modelo</label>
                    <select value={model} onChange={e => setModel(e.target.value)} style={{ ...inputStyle }}>
                      {selectedProvider?.models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Max Retries</label>
                  <select value={maxRetries} onChange={e => setMaxRetries(Number(e.target.value))} style={{ ...inputStyle }}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}x</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Digite seu prompt aqui..."
                    style={{ ...inputStyle, minHeight: '180px', resize: 'vertical', lineHeight: 1.7 }}
                  />
                </div>

                {error && (
                  <div style={{ background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '4px', padding: '10px 12px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#ff4455' }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={runExecution}
                  disabled={running || !selectedSchemaId || !prompt.trim()}
                  className={styles.btnPrimary}
                  style={{ opacity: running || !selectedSchemaId || !prompt.trim() ? 0.6 : 1 }}
                >
                  {running ? '⏳ Executando...' : '▶ Executar'}
                </button>
              </div>

              {/* Right — Output */}
              <div>
                <label style={labelStyle}>Output</label>
                <div style={{ background: '#0d0d0d', border: `1px solid ${result ? (result.success ? 'rgba(0,255,136,0.2)' : 'rgba(255,187,0,0.2)') : '#1e1e1e'}`, borderRadius: '6px', minHeight: '360px', overflow: 'hidden' }}>
                  {!result && !running && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#333' }}>
                      Execute um prompt para ver o output aqui
                    </div>
                  )}
                  {running && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px', flexDirection: 'column', gap: '12px' }}>
                      <div className={styles.spinner} />
                      <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555' }}>Chamando {provider}...</div>
                    </div>
                  )}
                  {result && (
                    <>
                      {/* Status bar */}
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '12px', background: '#111' }}>
                        <span style={{ display: 'inline-flex', padding: '2px 10px', background: result.success ? 'rgba(0,255,136,0.1)' : 'rgba(255,187,0,0.1)', border: `1px solid ${result.success ? 'rgba(0,255,136,0.3)' : 'rgba(255,187,0,0.3)'}`, borderRadius: '100px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: result.success ? 'var(--accent)' : '#ffbb00' }}>
                          {result.status}
                        </span>
                        <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>
                          {result.metadata?.attempts}x · {result.metadata?.latency_ms}ms · {result.metadata?.tokens_used} tokens · ~${estimateCost(result.metadata?.tokens_used || 0, model)}
                        </span>
                      </div>
                      {/* JSON output */}
                      <pre style={{ padding: '16px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#ccc', lineHeight: 1.8, overflow: 'auto', margin: 0, maxHeight: '400px' }}>
                        {JSON.stringify(result.output, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* TEMPLATES TAB */}
        {tab === 'templates' && (
          <>
            {importSuccess && (
              <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '4px', padding: '10px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: 'var(--accent)', marginBottom: '16px' }}>
                ✅ Template "{importSuccess}" importado para seus Schemas!
              </div>
            )}

            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Schema Templates</div>
                <div className={styles.sectionSub}>Schemas prontos para os casos de uso mais comuns. Importe com um clique e use imediatamente.</div>
              </div>
            </div>

            {TEMPLATES.map(category => (
              <div key={category.category} style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                  {category.category}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {category.items.map(template => (
                    <div key={template.slug} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.2s' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{template.name}</div>
                        <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>{template.description}</div>
                      </div>
                      <div style={{ background: '#0d0d0d', borderRadius: '4px', padding: '10px 12px', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', color: '#444', lineHeight: 1.6, flex: 1 }}>
                        {Object.keys(template.definition.properties || {}).map(k => (
                          <span key={k} style={{ display: 'inline-block', background: '#1a1a1a', border: '1px solid #222', borderRadius: '3px', padding: '1px 6px', margin: '2px', color: '#666' }}>{k}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => importTemplate(template)}
                          disabled={importingTemplate === template.slug}
                          className={styles.btnPrimary}
                          style={{ flex: 1, fontSize: '11px', padding: '7px 12px', opacity: importingTemplate === template.slug ? 0.7 : 1 }}
                        >
                          {importingTemplate === template.slug ? 'Importando...' : '+ Importar Schema'}
                        </button>
                        <button
                          onClick={() => {
                            setTab('playground')
                            setPrompt(template.prompt)
                          }}
                          style={{ padding: '7px 10px', background: 'transparent', border: '1px solid #222', borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', cursor: 'pointer' }}
                          title="Testar no Playground"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
