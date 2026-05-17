// src/routes/webhooks.ts — Webhook management routes
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth.js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const VALID_EVENTS = ['execution.success', 'execution.failed', 'execution.fallback']

async function supabaseRequest(method: string, path: string, body?: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase error: ${err}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : []
}

export async function webhookRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)

  // List webhooks for user
  app.get<{ Querystring: { user_id: string } }>('/webhooks', async (req, reply) => {
    const { user_id } = req.query as any
    if (!user_id) return reply.status(400).send({ error: 'user_id is required' })

    try {
      const data = await supabaseRequest('GET', `/webhooks?user_id=eq.${user_id}&order=created_at.desc`)
      return reply.send({ webhooks: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      return reply.status(500).send({ error: err.message })
    }
  })

  // Create webhook
  app.post('/webhooks', async (req, reply) => {
    const body = req.body as any
    const { user_id, name, url, secret, events } = body

    if (!user_id || !name || !url) {
      return reply.status(400).send({ error: 'user_id, name, and url are required' })
    }

    // Validate URL
    try { new URL(url) } catch {
      return reply.status(400).send({ error: 'Invalid URL' })
    }

    // Validate events
    const webhookEvents = events || ['execution.failed', 'execution.fallback']
    const invalidEvents = webhookEvents.filter((e: string) => !VALID_EVENTS.includes(e))
    if (invalidEvents.length > 0) {
      return reply.status(400).send({ error: `Invalid events: ${invalidEvents.join(', ')}` })
    }

    try {
      const data = await supabaseRequest('POST', '/webhooks', {
        user_id,
        name,
        url,
        secret: secret || null,
        events: webhookEvents,
        is_active: true,
      })
      return reply.status(201).send(Array.isArray(data) ? data[0] : data)
    } catch (err: any) {
      return reply.status(500).send({ error: err.message })
    }
  })

  // Update webhook
  app.put<{ Params: { id: string } }>('/webhooks/:id', async (req, reply) => {
    const { id } = req.params
    const body = req.body as any

    try {
      const data = await supabaseRequest('PATCH', `/webhooks?id=eq.${id}`, {
        ...body,
        updated_at: new Date().toISOString(),
      })
      return reply.send(Array.isArray(data) ? data[0] : data)
    } catch (err: any) {
      return reply.status(500).send({ error: err.message })
    }
  })

  // Delete webhook
  app.delete<{ Params: { id: string } }>('/webhooks/:id', async (req, reply) => {
    const { id } = req.params
    try {
      await supabaseRequest('DELETE', `/webhooks?id=eq.${id}`)
      return reply.status(204).send()
    } catch (err: any) {
      return reply.status(500).send({ error: err.message })
    }
  })

  // Test webhook
  app.post<{ Params: { id: string } }>('/webhooks/:id/test', async (req, reply) => {
    const { id } = req.params
    const body = req.body as any

    try {
      const webhooks = await supabaseRequest('GET', `/webhooks?id=eq.${id}`)
      const webhook = webhooks[0]
      if (!webhook) return reply.status(404).send({ error: 'Webhook not found' })

      const testPayload = {
        event: 'execution.failed',
        execution_id: 'test_' + Date.now(),
        schema_id: 'test-schema-id',
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        attempts: 3,
        latency_ms: 1234,
        status: 'FAILED',
        timestamp: new Date().toISOString(),
        test: true,
      }

      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Reliant-Webhook/1.0',
          'X-Reliant-Event': 'execution.failed',
          'X-Reliant-Test': 'true',
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(10000),
      })

      return reply.send({
        success: res.ok,
        status_code: res.status,
        payload: testPayload,
      })
    } catch (err: any) {
      return reply.status(500).send({ error: err.message })
    }
  })
}
