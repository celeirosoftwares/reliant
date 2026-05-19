import { FastifyInstance } from 'fastify'
import { executeWithReliability } from '../services/execution.js'
import { authMiddleware } from '../middleware/auth.js'
import { checkUsageLimit } from '../middleware/usage.js'

export async function executeRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)

  app.post('/execute', async (req, reply) => {
    const project = (req as any).project
    const body = req.body as any

    if (!project || !project.id) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid or missing API key',
      })
    }

    const { prompt, schema_id, provider, model, user_id, options } = body

    if (!prompt || !schema_id || !provider || !model || !user_id) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'prompt, schema_id, provider, model, and user_id are required',
      })
    }

    const validProviders = ['anthropic', 'openai', 'gemini', 'groq', 'mistral']
    if (!validProviders.includes(provider)) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: `provider must be one of: ${validProviders.join(', ')}`,
      })
    }

    const allowed = await checkUsageLimit(user_id, reply)
    if (!allowed) return

    try {
      const result = await executeWithReliability({
        prompt,
        schemaId: schema_id,
        provider,
        model,
        projectId: project.id,
        userId: user_id,
        maxRetries: options?.max_retries,
      })

      const usedFallback = result.providerUsed !== provider

      return reply.status(result.success ? 200 : 207).send({
        success: result.success,
        status: result.status,
        output: result.output,
        fallback_used: usedFallback,
        metadata: {
          execution_id: result.executionId,
          schema_version: result.schemaVersion,
          attempts: result.attempts,
          latency_ms: result.latencyMs,
          tokens_used: result.tokensUsed,
          provider: result.providerUsed,
          model: result.modelUsed,
          original_provider: provider,
          original_model: model,
        },
      })
    } catch (err: any) {
      req.log.error(err)
      return reply.status(500).send({
        error: 'Execution Failed',
        message: err.message,
        stack: err.stack,
      })
    }
  })
}
