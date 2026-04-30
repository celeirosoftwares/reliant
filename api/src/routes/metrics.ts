// src/routes/metrics.ts — Aggregated metrics routes
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

export async function metricsRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authMiddleware)

  // Summary metrics for the project
  server.get('/summary', async (request) => {
    const projectId = request.project!.id

    const query = request.query as { days?: string }
    const days = Math.min(90, Math.max(1, parseInt(query.days ?? '30')))
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const executions = await prisma.execution.findMany({
      where: { projectId, createdAt: { gte: since } },
      select: {
        status: true,
        latencyMs: true,
        tokensUsed: true,
        attempts: true,
        createdAt: true,
      },
    })

    const total = executions.length
    const successful = executions.filter((e) => e.status === 'success').length
    const failed = executions.filter((e) => e.status === 'failed').length
    const fallbacks = executions.filter((e) => e.status === 'fallback').length

    const avgLatency = total > 0
      ? Math.round(executions.reduce((sum, e) => sum + e.latencyMs, 0) / total)
      : 0

    const totalTokens = executions.reduce((sum, e) => sum + (e.tokensUsed ?? 0), 0)

    const avgAttempts = total > 0
      ? parseFloat((executions.reduce((sum, e) => sum + e.attempts, 0) / total).toFixed(2))
      : 0

    // Daily breakdown
    const dailyMap = new Map<string, { total: number; success: number; failed: number; tokens: number }>()
    for (const exec of executions) {
      const day = exec.createdAt.toISOString().split('T')[0]
      const entry = dailyMap.get(day) ?? { total: 0, success: 0, failed: 0, tokens: 0 }
      entry.total++
      if (exec.status === 'success') entry.success++
      if (exec.status === 'failed') entry.failed++
      entry.tokens += exec.tokensUsed ?? 0
      dailyMap.set(day, entry)
    }

    const daily = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }))

    return {
      period_days: days,
      total_executions: total,
      success_rate: total > 0 ? parseFloat(((successful / total) * 100).toFixed(1)) : 0,
      status_breakdown: {
        success: successful,
        failed,
        fallback: fallbacks,
      },
      avg_latency_ms: avgLatency,
      avg_attempts: avgAttempts,
      total_tokens: totalTokens,
      daily,
    }
  })

  // Metrics per schema
  server.get<{ Params: { id: string } }>('/schemas/:id', async (request, reply) => {
    const schema = await prisma.schema.findFirst({
      where: { id: request.params.id, projectId: request.project!.id },
    })

    if (!schema) {
      return reply.status(404).send({ error: 'Schema not found' })
    }

    const executions = await prisma.execution.findMany({
      where: { schemaId: schema.id },
      select: {
        status: true,
        latencyMs: true,
        tokensUsed: true,
        attempts: true,
      },
    })

    const total = executions.length
    const successful = executions.filter((e) => e.status === 'success').length

    return {
      schema_id: schema.id,
      schema_name: schema.name,
      schema_slug: schema.slug,
      total_executions: total,
      success_rate: total > 0 ? parseFloat(((successful / total) * 100).toFixed(1)) : 0,
      avg_latency_ms: total > 0
        ? Math.round(executions.reduce((sum, e) => sum + e.latencyMs, 0) / total)
        : 0,
      total_tokens: executions.reduce((sum, e) => sum + (e.tokensUsed ?? 0), 0),
      avg_attempts: total > 0
        ? parseFloat((executions.reduce((sum, e) => sum + e.attempts, 0) / total).toFixed(2))
        : 0,
    }
  })
}
