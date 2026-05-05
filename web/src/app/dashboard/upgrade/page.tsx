'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0 as number | null,
    executions: '1.000',
    features: ['1.000 execuções/mês', 'Dashboard completo', 'JS + Python SDK', 'Todos os providers', 'System prompt customizado', 'Suporte comunidade'],
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29 as number | null,
    executions: '50.000',
    features: ['50.000 execuções/mês', 'Dashboard completo', 'Todos os providers', '⚡ Fallback multi-provider', 'System prompt customizado', 'Logs 30 dias', 'Suporte por email'],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99 as number | null,
    executions: '250.000',
    features: ['250.000 execuções/mês', 'Dashboard completo', 'Todos os providers', '⚡ Fallback multi-provider', 'System prompt customizado', 'Alertas de falha', 'Logs 60 dias', 'Suporte prioritário'],
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 299 as number | null,
    executions: '1.000.000',
    features: ['1.000.000 execuções/mês', 'Todos os providers', '⚡ Fallback multi-provider', 'System prompt customizado', 'Alertas avançados', 'Logs 90 dias', 'SLA 99.9%', 'Suporte dedicado'],
    highlight: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null as number | null,
    executions: 'Ilimitado',
    features: ['Execuções ilimitadas', 'Todos os providers', '⚡ Fallback multi-provider', 'System prompt customizado', 'Logs ilimitados', 'SSO + RBAC', 'SLA customizado', 'Suporte dedicado'],
    highlight: false,
  },
]

export default function UpgradePage() {
  const searchParams = useSearchParams()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [hasSubscription, setHasSubscription] = useState(false)
  const [usage, setUsage] = useState<{ count: number; limit: number } | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    if (searchParams.get('success') === 'true') setNotification({ type: 'success', msg: '🎉 Upgrade realizado com sucesso!' })
    if (searchParams.get('canceled') === 'true') setNotification({ type: 'error', msg: 'Checkout cancelado. Nenhuma cobrança foi feita.' })
  }, [searchParams])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const [profileRes, usageRes] = await Promise.all([
        supabase.from('profiles').select('plan, stripe_subscription_id').eq('id', session.user.id).single(),
        supabase.from('usage').select('executions_count').eq('user_id', session.user.id).eq('period', new Date().toISOString().slice(0, 7)).single(),
      ])
      const plan = profileRes.data?.plan || 'free'
      setCurrentPlan(plan)
      setHasSubscription(!!profileRes.data?.stripe_subscription_id)
      if (usageRes.data) {
        const planData = PLANS.find(p => p.id === plan)
        const limit = plan === 'enterprise' ? -1 : parseInt(planData?.executions?.replace(/\./g, '') || '1000')
        setUsage({ count: usageRes.data.executions_count, limit })
      }
    }
    load()
  }, [])

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, access_token: session?.access_token }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setNotification({ type: 'error', msg: data.error || 'Erro ao iniciar checkout' })
    } catch { setNotification({ type: 'error', msg: 'Erro ao conectar com o Stripe' }) }
    setCheckoutLoading(null)
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: session?.access_token }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setNotification({ type: 'error', msg: data.error || 'Erro ao abrir portal' })
    } catch { setNotification({ type: 'error', msg: 'Erro ao conectar com o Stripe' }) }
    setPortalLoading(false)
  }

  const usagePercent = usage && usage.limit > 0 ? Math.min(100, Math.round((usage.count / usage.limit) * 100)) : 0

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>planos</span></div>
        <div className={styles.topbarRight}>
          {hasSubscription && (
            <button onClick={handlePortal} disabled={portalLoading} className={styles.btnGhost}>
              {portalLoading ? 'Abrindo...' : '⚙ Gerenciar assinatura'}
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {notification && (
          <div style={{ background: notification.type === 'success' ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)', border: `1px solid ${notification.type === 'success' ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,68,0.3)'}`, borderRadius: '6px', padding: '12px 16px', fontFamily: 'var(--font-ui-mono)', fontSize: '13px', color: notification.type === 'success' ? 'var(--accent)' : '#ff4455', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {notification.msg}
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>×</button>
          </div>
        )}

        {usage && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '6px', padding: '20px 24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', color: 'var(--text)' }}>
                Uso este mês — plano <strong style={{ color: 'var(--accent)' }}>{currentPlan}</strong>
              </div>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', color: usagePercent >= 90 ? '#ff4444' : '#888' }}>
                {usage.count.toLocaleString()} / {usage.limit === -1 ? '∞' : usage.limit.toLocaleString()} execuções
              </div>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '100px', width: `${usagePercent}%`, background: usagePercent >= 90 ? '#ff4444' : usagePercent >= 70 ? '#ffbb00' : 'var(--accent)', transition: 'width 0.3s ease' }} />
            </div>
            {usagePercent >= 80 && (
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#ffbb00', marginTop: '8px' }}>
                ⚠️ Você está usando {usagePercent}% do seu limite. Faça upgrade para continuar sem interrupções.
              </div>
            )}
          </div>
        )}

        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Planos</div>
            <div className={styles.sectionSub}>Escale conforme seu uso cresce. Cancele quando quiser.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {PLANS.map(plan => {
            const isCurrent = plan.id === currentPlan
            const isLoading = checkoutLoading === plan.id
            return (
              <div key={plan.id} style={{ background: plan.highlight ? '#111' : '#0d0d0d', border: `1px solid ${isCurrent ? 'rgba(0,255,136,0.4)' : plan.highlight ? 'rgba(0,255,136,0.15)' : '#1e1e1e'}`, borderRadius: '6px', padding: '24px 20px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-ui-mono)', fontSize: '10px', fontWeight: 600, padding: '3px 12px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                    Mais popular
                  </div>
                )}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px', fontFamily: 'var(--font-ui-mono)', fontSize: '9px', color: 'var(--accent)', padding: '2px 8px' }}>
                    Atual
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ marginBottom: '16px' }}>
                  {plan.price === null ? (
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>Custom</div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: plan.price === 0 ? '#888' : 'var(--text)' }}>
                        {plan.price === 0 ? 'Grátis' : `$${plan.price}`}
                      </span>
                      {plan.price !== null && plan.price > 0 && <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>/mês</span>}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginTop: '4px' }}>{plan.executions} execuções/mês</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginBottom: '20px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#666' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  disabled={isCurrent || isLoading}
                  onClick={() => {
                    if (plan.id === 'enterprise') window.open('mailto:hello@reliant.dev?subject=Enterprise Plan', '_blank')
                    else if (!isCurrent && plan.price && plan.price > 0) handleCheckout(plan.id)
                  }}
                  style={{ padding: '9px 12px', background: isCurrent ? 'transparent' : plan.highlight ? 'var(--accent)' : '#1a1a1a', color: isCurrent ? '#555' : plan.highlight ? '#000' : '#888', border: `1px solid ${isCurrent ? '#222' : plan.highlight ? 'var(--accent)' : '#2a2a2a'}`, borderRadius: '4px', fontFamily: 'var(--font-ui-mono)', fontSize: '11px', fontWeight: plan.highlight ? 600 : 400, cursor: isCurrent ? 'default' : 'pointer', width: '100%', transition: 'all 0.15s', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? 'Abrindo checkout...' : isCurrent ? 'Plano atual' : plan.id === 'enterprise' ? 'Falar conosco' : 'Fazer upgrade'}
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '24px', background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: '6px', padding: '16px 20px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
          💡 <strong style={{ color: '#888' }}>Cada chamada ao /execute conta como 1 execução</strong>, independente do número de retries. O contador reseta no primeiro dia de cada mês. Você pode cancelar sua assinatura a qualquer momento pelo botão "Gerenciar assinatura".
        </div>
      </div>
    </div>
  )
}
