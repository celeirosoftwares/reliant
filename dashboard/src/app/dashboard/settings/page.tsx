// src/app/dashboard/settings/page.tsx — Settings page
'use client'
import { useState } from 'react'
import { Key, Copy, Check, Shield } from 'lucide-react'
import { getApiKey } from '@/lib/api'

export default function SettingsPage() {
  const [copiedKey, setCopiedKey] = useState(false)
  const apiKey = getApiKey() ?? ''

  function copyKey() {
    navigator.clipboard.writeText(apiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const maskedKey = apiKey.slice(0, 8) + '•'.repeat(Math.max(0, apiKey.length - 12)) + apiKey.slice(-4)

  return (
    <div className="animate-in" style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Settings</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>Manage your project configuration</p>

      {/* API Key Section */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>API Key</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Use this key in the X-Reliant-Key header</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            flex: 1, background: 'var(--bg-base)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
            color: 'var(--text-muted)', letterSpacing: '0.5px',
          }}>
            {maskedKey}
          </div>
          <button onClick={copyKey} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-base)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            color: copiedKey ? 'var(--success)' : 'var(--text-muted)',
            fontSize: '13px', cursor: 'pointer', transition: 'all .15s',
          }}>
            {copiedKey ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>
      </div>

      {/* Quick Start */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--success-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Quick Start</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Integrate in under 10 lines of code</div>
          </div>
        </div>

        <pre style={{
          background: 'var(--bg-base)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '16px', overflow: 'auto',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
          lineHeight: 1.7, color: 'var(--text-secondary)',
        }}>
{`import { Reliant } from 'reliant-js';

const reliant = new Reliant({
  apiKey: '${apiKey.slice(0, 8)}...'
});

const result = await reliant.execute({
  prompt: 'Extract contact info...',
  schemaId: 'YOUR_SCHEMA_ID',
  provider: 'openai',
  model: 'gpt-4o'
});

console.log(result.output);`}
        </pre>
      </div>
    </div>
  )
}
