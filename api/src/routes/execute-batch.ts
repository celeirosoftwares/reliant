import { FastifyInstance } from 'fastify'
import { executeWithReliability } from '../services/execution.js'
import { authMiddleware } from '../middleware/auth.js'
import { checkUsageLimit } from '../middleware/usage.js'

// Cost-optimized model cascade — cheapest first
const COST_OPTIMIZED_CASCADE: Record<string, string[]> = {
  anthropic: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-20250514', 'claude-opus-4-5'],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
  gemini: ['gemini-1.5-flash', 'gemini-1.5-pro'],
  groq: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
  mistral: ['mistral-small-latest', 'mistral-large-latest'],
}

export async function executeBatchRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)

  app.post('/execute-batch', async (req, reply) => {
    const project = (req as any).project
    const body = req.body as any

    if (!project || !project.id) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or missing API key' })
    }

    const { prompts, schema_id, provider, model, user_id, options } = body

    // Validations
    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return reply.status(400).send({ error: 'Validation Error', message: 'prompts must be a non-empty array' })
    }
    if (prompts.length > 100) {
      return reply.status(400).send({ error: 'Validation Error', message: 'Maximum 100 prompts per batch' })
    }
    if (!schema_id || !provider || !model || !user_id) {
      return reply.status(400).send({ error: 'Validation Error', message: 'schema_id, provider, model, and user_id are required' })
    }

    const validProviders = ['anthropic', 'openai', 'gemini', 'groq', 'mistral']
    if (!validProviders.includes(provider)) {
      return reply.status(400).send({ error: 'Validation Error', message: `provider must be one of: ${validProviders.join(', ')}` })
    }

    const concurrency = Math.min(options?.concurrency ?? 3, 10)
    const costOptimized = options?.cost_optimized ?? false
    const maxRetries = options?.max_retries ?? 3
    const startTime = Date.now()

    // Check usage limit once for the whole batch
    const allowed = await checkUsageLimit(user_id, reply)
    if (!allowed) return

    // Build model cascade for cost optimization
    const modelCascade = costOptimized
      ? (COST_OPTIMIZED_CASCADE[provider] || [model])
      : [model]

    // Process prompts with concurrency control
    const results: any[] = new Array(prompts.length)
    const queue = prompts.map((prompt: string, index: number) => ({ prompt, index }))
    let totalTokens = 0
    let successCount = 0
    let fallbackCount = 0
    let failedCount = 0

    async function processItem(item: { prompt: string; index: number }) {
      // Try each model in cascade
      for (const currentModel of modelCascade) {
        try {
          const result = await executeWithReliability({
            prompt: item.prompt,
            schemaId: schema_id,
            provider,
            model: currentModel,
            projectId: project.id,
            userId: user_id,
            maxRetries,
          })

          totalTokens += result.tokensUsed

          if (result.success) {
            successCount++
            results[item.index] = {
              index: item.index,
              success: true,
              status: costOptimized && currentModel !== model ? 'SUCCESS_OPTIMIZED' : result.status,
              output: result.output,
              metadata: {
                execution_id: result.executionId,
                schema_version: result.schemaVersion,
                attempts: result.attempts,
                latency_ms: result.latencyMs,
                tokens_used: result.tokensUsed,
                provider: result.providerUsed,
                model: currentModel,
                cost_optimized: costOptimized && currentModel !== model,
              },
            }
            return // Success — stop cascade
          }

          // If failed but not last model in cascade, try next
          if (modelCascade.indexOf(currentModel) < modelCascade.length - 1) {
            continue
          }

          // Last model failed
          if (result.status === 'FALLBACK') fallbackCount++
          else failedCount++

          results[item.index] = {
            index: item.index,
            success: false,
            status: result.status,
            output: result.output,
            metadata: {
              execution_id: result.executionId,
              schema_version: result.schemaVersion,
              attempts: result.attempts,
              latency_ms: result.latencyMs,
              tokens_used: result.tokensUsed,
              provider: result.providerUsed,
              model: currentModel,
            },
          }
        } catch (err: any) {
          results[item.index] = {
            index: item.index,
            success: false,
            status: 'FAILED',
            output: null,
            error: err.message,
            metadata: { model: currentModel, provider },
          }
          failedCount++
        }
      }
    }

    // Process with concurrency limit
    async function processWithConcurrency() {
      const workers: Promise<void>[] = []

      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        const worker = processItem(item)
        workers.push(worker)

        // When we hit concurrency limit, wait for one to finish
        if (workers.length >= concurrency) {
          await Promise.race(workers.map((w, idx) => w.then(() => idx)))
          // Remove completed workers
          for (let j = workers.length - 1; j >= 0; j--) {
            // Simple approach: just await all when at limit
          }
          if (i % concurrency === concurrency - 1) {
            await Promise.all(workers.splice(0, concurrency))
          }
        }
      }
      // Process remaining
      await Promise.all(workers)
    }

    await processWithConcurrency()

    const latencyMs = Date.now() - startTime

    return reply.status(200).send({
      success: failedCount === 0,
      total: prompts.length,
      summary: {
        success: successCount,
        fallback: fallbackCount,
        failed: failedCount,
        success_rate: Math.round((successCount / prompts.length) * 1000) / 10,
        total_tokens: totalTokens,
        total_latency_ms: latencyMs,
        avg_latency_ms: Math.round(latencyMs / prompts.length),
      },
      results,
    })
  })
}
