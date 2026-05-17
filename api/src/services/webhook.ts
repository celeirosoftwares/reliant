// src/services/webhook.ts — Webhook dispatcher
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type WebhookEvent = 'execution.success' | 'execution.failed' | 'execution.fallback'

export interface WebhookPayload {
  event: WebhookEvent
  execution_id: string
  schema_id: string | null
  provider: string
  model: string
  attempts: number
  latency_ms: number
  status: string
  timestamp: string
}

interface WebhookRow {
  id: string
  url: string
  secret: string | null
  events: string[]
}

async function getUserWebhooks(userId: string, event: WebhookEvent): Promise<WebhookRow[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/webhooks?user_id=eq.${userId}&is_active=eq.true&select=id,url,secret,events`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    if (!res.ok) return []
    const data = await res.json() as WebhookRow[]
    return data.filter(w => w.events.includes(event))
  } catch {
    return []
  }
}

function buildSignature(payload: string, secret: string): string {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

async function dispatchWebhook(webhook: WebhookRow, payload: WebhookPayload): Promise<void> {
  const body = JSON.stringify(payload)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Reliant-Webhook/1.0',
    'X-Reliant-Event': payload.event,
    'X-Reliant-Delivery': crypto.randomUUID(),
  }

  if (webhook.secret) {
    headers['X-Reliant-Signature'] = buildSignature(body, webhook.secret)
  }

  try {
    const res = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(10000), // 10s timeout
    })
    console.log(`Webhook ${webhook.id} dispatched: ${res.status}`)
  } catch (err: any) {
    console.error(`Webhook ${webhook.id} failed:`, err.message)
  }
}

export async function dispatchWebhooks(userId: string, event: WebhookEvent, payload: Omit<WebhookPayload, 'event' | 'timestamp'>): Promise<void> {
  const webhooks = await getUserWebhooks(userId, event)
  if (webhooks.length === 0) return

  const fullPayload: WebhookPayload = {
    ...payload,
    event,
    timestamp: new Date().toISOString(),
  }

  // Fire and forget — don't await
  Promise.all(webhooks.map(w => dispatchWebhook(w, fullPayload))).catch(() => {})
}
