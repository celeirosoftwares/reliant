// src/routes/execute.ts — Main execution endpoint
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth.js'
import { execute, ExecutionError } from '../services/execution-engine.js'
import { SUPPORTED_PROVIDERS } from '../providers/index.js'

export async function executeRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authMiddleware)

  server.post('/execute', async (request, reply) => {
    const body = request.body as {
      prompt?: string
      schema_id?: string
      provider?: string
      model?: string
      options?: {
        max_retries?: number
        temperature?: number
        max_tokens?: number
        fallback?: { enabled?: boolean }
      }
    }

    // Validate required fields
    if (!body.prompt || typeof body.prompt !== 'string') {
      return reply.status(400).send({
        error: 'Validation error',
        message: 'prompt is required and must be a string',
      })
    }

    if (!body.schema_id) {
      return reply.status(400).send({
        error: 'Validation error',
        message: 'schema_id is required',
      })
    }

    if (!body.provider || !SUPPORTED_PROVIDERS.includes(body.provider as any)) {
      return reply.status(400).send({
        error: 'Validation error',
        message: `provider is required. Supported: ${SUPPORTED_PROVIDERS.join(', ')}`,
      })
    }

    if (!body.model) {
      return reply.status(400).send({
        error: 'Validation error',
        message: 'model is required',
      })
    }

    try {
      const result = await execute({
        projectId: request.project!.id,
        prompt: body.prompt,
        schemaId: body.schema_id,
        provider: body.provider,
        model: body.model,
        options: body.options,
      })

      const statusCode = result.success ? 200 : 422
      return reply.status(statusCode).send(result)
    } catch (err) {
      if (err instanceof ExecutionError) {
        const statusMap: Record<string, number> = {
          SCHEMA_NOT_FOUND: 404,
        }
        return reply.status(statusMap[err.code] ?? 400).send({
          error: err.code,
          message: err.message,
        })
      }

      request.log.error(err, 'Execution failed')
      return reply.status(500).send({
        error: 'Internal error',
        message: 'Execution failed. Please try again.',
      })
    }
  })
}
