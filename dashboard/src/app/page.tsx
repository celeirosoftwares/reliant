// src/app/page.tsx — Login page (API Key entry)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight, Zap, Eye, RefreshCw } from 'lucide-react'
import { setApiKey, api } from '@/lib/api'

export default function LoginPage() {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) return
    setLoading(true)
    setError(null)

    try {
      setApiKey(key.trim())
      // Test the key by fetching metrics
      await api('/metrics/summary?days=1')
      router.push('/dashboard')
    } catch {
      setError('Invalid API key. Please check and try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(34,197,94,0.04), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }} className="animate-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>Reliant</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>The reliability layer for LLM-powered products</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Connect your project</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Enter your Reliant API key to access the dashboard</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>API Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="rel_••••••••••••••••"
                required
                style={{
                  width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '11px 14px', color: 'var(--text-primary)',
                  fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !key.trim()}
              style={{
                width: '100%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading || !key.trim() ? 0.6 : 1,
                transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 0 20px rgba(99,102,241,0.2)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {loading ? 'Connecting...' : 'Access Dashboard'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '24px' }}>
          {[
            { icon: <Zap size={16} />, label: 'Smart Retry' },
            { icon: <Eye size={16} />, label: 'Observability' },
            { icon: <RefreshCw size={16} />, label: 'Validation' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '12px' }}>
              <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
