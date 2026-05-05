import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { executeWithReliability } from '../services/execution.js'
import { checkUsageLimit } from '../middleware/usage.js'

const executeSchema = z.object({
  prompt: z.string().min(1),
  schema_id: z.string().min(1),
  provider: z.enum(['anthropic', 'openai', 'gemini', 'groq', 'mistral']),
  model: z.string().min(1),
  user_id: z.string().min(1),
  options: z.object({
    max_retries: z.number().min(1).max(5).optional(),
  }).optional(),
})

export async function executeRoutes(app: FastifyInstance) {
  app.post('/execute', async (req, reply) => {
    const project = (req as any).project

    const body = executeSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: body.error.flatten(),
      })
    }

    const { prompt, schema_id, provider, model, user_id, options } = body.data

    // Check usage limit before executing
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

      return reply.status(result.success ? 200 : 207).send({
        success: result.success,
        status: result.status,
        output: result.output,
        metadata: {
          execution_id: result.executionId,
          attempts: result.attempts,
          latency_ms: result.latencyMs,
          tokens_used: result.tokensUsed,
          provider,
          model,
        },
      })
    } catch (err: any) {
      req.log.error(err)
      return reply.status(500).send({
        error: 'Execution Failed',
        message: err.message,
      })
    }
  })
}