// src/routes/analytics.ts — Advanced analytics endpoints
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

// Token cost per 1M tokens (input + output average) in USD
const MODEL_COSTS: Record<string, number> = {
  // Anthropic
  'claude-sonnet-4-20250514': 6.0,
  'claude-opus-4-5': 30.0,
  'claude-haiku-4-5-20251001': 1.0,
  // OpenAI
  'gpt-4o': 7.5,
  'gpt-4o-mini': 0.3,
  'gpt-4-turbo': 15.0,
  // Gemini
  'gemini-1.5-pro': 3.5,
  'gemini-1.5-flash': 0.15,
  // Groq
  'llama-3.3-70b-versatile': 0.8,
  'mixtral-8x7b-32768': 0.5,
  // Mistral
  'mistral-large-latest': 6.0,
  'mistral-small-latest': 1.0,
}

function getCostForTokens(model: string, tokens: number): number {
  const costPer1M = MODEL_COSTS[model] ?? 5.0 // default $5/1M
  return (tokens / 1_000_000) * costPer1M
}

export async function analyticsRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authMiddleware)

  // Summary metrics
  server.get<{ Querystring: { days?: string } }>('/summary', async (request) => {
    const days = parseInt(request.query.days || '30')
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const executions = await prisma.execution.findMany({
      where: { projectId: request.project!.id, createdAt: { gte: since } },
      select: {
        id: true,
        status: true,
        attempts: true,
        latencyMs: true,
        tokensUsed: true,
        model: true,
        provider: true,
        createdAt: true,
      },
    })

    const total = executions.length
    const success = executions.filter(e => e.status === 'SUCCESS').length
    const fallback = executions.filter(e => e.status === 'FALLBACK').length
    const failed = executions.filter(e => e.status === 'FAILED').length
    const avgLatency = total > 0 ? Math.round(executions.reduce((s, e) => s + e.latencyMs, 0) / total) : 0
    const avgAttempts = total > 0 ? Math.round((executions.reduce((s, e) => s + e.attempts, 0) / total) * 100) / 100 : 0
    const totalTokens = executions.reduce((s, e) => s + (e.tokensUsed || 0), 0)
    const totalCost = executions.reduce((s, e) => s + getCostForTokens(e.model, e.tokensUsed || 0), 0)

    // Daily breakdown
    const dailyMap = new Map<string, { total: number; success: number; tokens: number; cost: number }>()
    for (const e of executions) {
      const day = e.createdAt.toISOString().slice(0, 10)
      const existing = dailyMap.get(day) || { total: 0, success: 0, tokens: 0, cost: 0 }
      existing.total++
      if (e.status === 'SUCCESS') existing.success++
      existing.tokens += e.tokensUsed || 0
      existing.cost += getCostForTokens(e.model, e.tokensUsed || 0)
      dailyMap.set(day, existing)
    }

    // Fill missing days
    const daily = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      const data = dailyMap.get(date) || { total: 0, success: 0, tokens: 0, cost: 0 }
      daily.push({ date, ...data })
    }

    return {
      period_days: days,
      total_executions: total,
      success_rate: total > 0 ? Math.round((success / total) * 1000) / 10 : 0,
      status_breakdown: { success, fallback, failed },
      avg_latency_ms: avgLatency,
      avg_attempts: avgAttempts,
      total_tokens: totalTokens,
      estimated_cost_usd: Math.round(totalCost * 10000) / 10000,
      daily,
    }
  })

  // Success rate by schema
  server.get<{ Querystring: { days?: string } }>('/by-schema', async (request) => {
    const days = parseInt(request.query.days || '30')
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const executions = await prisma.execution.findMany({
      where: { projectId: request.project!.id, createdAt: { gte: since }, schemaId: { not: null } },
      select: { schemaId: true, status: true, tokensUsed: true, model: true, latencyMs: true },
    })

    const schemas = await prisma.schema.findMany({
      where: { projectId: request.project!.id },
      select: { id: true, name: true, slug: true },
    })

    const schemaMap = new Map(schemas.map(s => [s.id, s]))
    const statsMap = new Map<string, { name: string; slug: string; total: number; success: number; tokens: number; cost: number; latency: number }>()

    for (const e of executions) {
      if (!e.schemaId) continue
      const schema = schemaMap.get(e.schemaId)
      if (!schema) continue
      const existing = statsMap.get(e.schemaId) || { name: schema.name, slug: schema.slug, total: 0, success: 0, tokens: 0, cost: 0, latency: 0 }
      existing.total++
      if (e.status === 'SUCCESS') existing.success++
      existing.tokens += e.tokensUsed || 0
      existing.cost += getCostForTokens(e.model, e.tokensUsed || 0)
      existing.latency += e.latencyMs
      statsMap.set(e.schemaId, existing)
    }

    const result = Array.from(statsMap.entries()).map(([id, s]) => ({
      schema_id: id,
      name: s.name,
      slug: s.slug,
      total_executions: s.total,
      success_rate: s.total > 0 ? Math.round((s.success / s.total) * 1000) / 10 : 0,
      avg_latency_ms: s.total > 0 ? Math.round(s.latency / s.total) : 0,
      total_tokens: s.tokens,
      estimated_cost_usd: Math.round(s.cost * 10000) / 10000,
    })).sort((a, b) => b.total_executions - a.total_executions)

    return { period_days: days, schemas: result }
  })

  // Success rate by provider
  server.get<{ Querystring: { days?: string } }>('/by-provider', async (request) => {
    const days = parseInt(request.query.days || '30')
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const executions = await prisma.execution.findMany({
      where: { projectId: request.project!.id, createdAt: { gte: since } },
      select: { provider: true, model: true, status: true, tokensUsed: true, latencyMs: true, attempts: true },
    })

    const statsMap = new Map<string, { total: number; success: number; tokens: number; cost: number; latency: number; attempts: number; models: Set<string> }>()

    for (const e of executions) {
      const existing = statsMap.get(e.provider) || { total: 0, success: 0, tokens: 0, cost: 0, latency: 0, attempts: 0, models: new Set() }
      existing.total++
      if (e.status === 'SUCCESS') existing.success++
      existing.tokens += e.tokensUsed || 0
      existing.cost += getCostForTokens(e.model, e.tokensUsed || 0)
      existing.latency += e.latencyMs
      existing.attempts += e.attempts
      existing.models.add(e.model)
      statsMap.set(e.provider, existing)
    }

    const result = Array.from(statsMap.entries()).map(([provider, s]) => ({
      provider,
      total_executions: s.total,
      success_rate: s.total > 0 ? Math.round((s.success / s.total) * 1000) / 10 : 0,
      avg_latency_ms: s.total > 0 ? Math.round(s.latency / s.total) : 0,
      avg_attempts: s.total > 0 ? Math.round((s.attempts / s.total) * 100) / 100 : 0,
      total_tokens: s.tokens,
      estimated_cost_usd: Math.round(s.cost * 10000) / 10000,
      models_used: Array.from(s.models),
    })).sort((a, b) => b.total_executions - a.total_executions)

    return { period_days: days, providers: result }
  })
}
