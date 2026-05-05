'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from '@/components/dashboard/Dashboard.module.css'

// Replace the PLANS array in upgrade/page.tsx with this:

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    executions: '1.000',
    features: [
      '1.000 execuções/mês',
      'Dashboard completo',
      'JS + Python SDK',
      'Todos os providers',
      'System prompt customizado',
      'Suporte comunidade',
    ],
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    executions: '50.000',
    features: [
      '50.000 execuções/mês',
      'Dashboard completo',
      'Todos os providers',
      '⚡ Fallback multi-provider',
      'System prompt customizado',
      'Logs 30 dias',
      'Suporte por email',
    ],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    executions: '250.000',
    features: [
      '250.000 execuções/mês',
      'Dashboard completo',
      'Todos os providers',
      '⚡ Fallback multi-provider',
      'System prompt customizado',
      'Alertas de falha',
      'Logs 60 dias',
      'Suporte prioritário',
    ],
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 299,
    executions: '1.000.000',
    features: [
      '1.000.000 execuções/mês',
      'Todos os providers',
      '⚡ Fallback multi-provider',
      'System prompt customizado',
      'Alertas avançados',
      'Logs 90 dias',
      'SLA 99.9%',
      'Suporte dedicado',
    ],
    highlight: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    executions: 'Ilimitado',
    features: [
      'Execuções ilimitadas',
      'Todos os providers',
      '⚡ Fallback multi-provider',
      'System prompt customizado',
      'Logs ilimitados',
      'SSO + RBAC',
      'SLA customizado',
      'Suporte dedicado',
    ],
    highlight: false,
  },
]

export default function UpgradePage() {
  const [currentPlan, setCurrentPlan] = useState('free')
  const [usage, setUsage] = useState<{ count: number; limit: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [profileRes, usageRes] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', session.user.id).single(),
        supabase.from('usage').select('executions_count').eq('user_id', session.user.id).eq('period', new Date().toISOString().slice(0, 7)).single(),
      ])

      if (profileRes.data) setCurrentPlan(profileRes.data.plan)

      if (usageRes.data) {
        const plan = PLANS.find(p => p.id === profileRes.data?.plan)
        const limit = plan?.id === 'enterprise' ? -1 : parseInt(plan?.executions?.replace(/\./g, '') || '1000')
        setUsage({ count: usageRes.data.executions_count, limit })
      }

      setLoading(false)
    }
    load()
  }, [])

  const usagePercent = usage && usage.limit > 0
    ? Math.min(100, Math.round((usage.count / usage.limit) * 100))
    : 0

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarTitle}>reliant / <span>planos</span></div>
      </div>

      <div className={styles.content}>
        {/* Usage bar */}
        {usage && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '6px', padding: '20px 24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', color: 'var(--text)' }}>
                Uso este mês
              </div>
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '13px', color: usagePercent >= 90 ? '#ff4444' : '#888' }}>
                {usage.count.toLocaleString()} / {usage.limit === -1 ? '∞' : usage.limit.toLocaleString()} execuções
              </div>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: '100px',
                width: `${usagePercent}%`,
                background: usagePercent >= 90 ? '#ff4444' : usagePercent >= 70 ? '#ffbb00' : 'var(--accent)',
                transition: 'width 0.3s ease',
              }} />
            </div>
            {usagePercent >= 80 && (
              <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#ffbb00', marginTop: '8px' }}>
                ⚠️ Você está usando {usagePercent}% do seu limite mensal. Considere fazer upgrade.
              </div>
            )}
          </div>
        )}

        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>Planos</div>
            <div className={styles.sectionSub}>Escale conforme seu uso cresce</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {PLANS.map(plan => {
            const isCurrent = plan.id === currentPlan
            return (
              <div key={plan.id} style={{
                background: plan.highlight ? '#111' : '#0d0d0d',
                border: `1px solid ${isCurrent ? 'rgba(0,255,136,0.4)' : plan.highlight ? 'rgba(0,255,136,0.15)' : '#1e1e1e'}`,
                borderRadius: '6px',
                padding: '24px 20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}>
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
                      {plan.price > 0 && <span style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555' }}>/mês</span>}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--font-ui-mono)', fontSize: '11px', color: '#555', marginTop: '4px' }}>
                    {plan.executions} execuções/mês
                  </div>
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
                  disabled={isCurrent}
                  onClick={() => {
                    if (plan.id === 'enterprise') {
                      window.open('mailto:hello@reliant.dev?subject=Enterprise Plan', '_blank')
                    } else if (!isCurrent) {
                      alert('Integração com pagamento em breve. Entre em contato: hello@reliant.dev')
                    }
                  }}
                  style={{
                    padding: '9px 12px',
                    background: isCurrent ? 'transparent' : plan.highlight ? 'var(--accent)' : '#1a1a1a',
                    color: isCurrent ? '#555' : plan.highlight ? '#000' : '#888',
                    border: `1px solid ${isCurrent ? '#222' : plan.highlight ? 'var(--accent)' : '#2a2a2a'}`,
                    borderRadius: '4px',
                    fontFamily: 'var(--font-ui-mono)',
                    fontSize: '11px',
                    fontWeight: plan.highlight ? 600 : 400,
                    cursor: isCurrent ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    width: '100%',
                  }}
                >
                  {isCurrent ? 'Plano atual' : plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '24px', background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: '6px', padding: '16px 20px', fontFamily: 'var(--font-ui-mono)', fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
          💡 <strong style={{ color: '#888' }}>Cada chamada ao /execute conta como 1 execução</strong>, independente do número de retries. O contador reseta no primeiro dia de cada mês.
        </div>
      </div>
    </div>
  )
}
