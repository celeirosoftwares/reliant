// src/routes/executions.ts — Execution logs & detail routes
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

export async function executionsRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authMiddleware)

  // List executions (paginated)
  server.get('/', async (request) => {
    const query = request.query as {
      page?: string
      limit?: string
      status?: string
      schema_id?: string
    }

    const page = Math.max(1, parseInt(query.page ?? '1'))
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20')))
    const skip = (page - 1) * limit

    const where: any = { projectId: request.project!.id }
    if (query.status) where.status = query.status
    if (query.schema_id) where.schemaId = query.schema_id

    const [executions, total] = await Promise.all([
      prisma.execution.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          schema: { select: { name: true, slug: true } },
        },
      }),
      prisma.execution.count({ where }),
    ])

    return {
      executions: executions.map(formatExecution),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  })

  // Get execution detail
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const execution = await prisma.execution.findFirst({
      where: { id: request.params.id, projectId: request.project!.id },
      include: {
        schema: { select: { name: true, slug: true, definition: true } },
      },
    })

    if (!execution) {
      return reply.status(404).send({ error: 'Execution not found' })
    }

    return formatExecution(execution)
  })
}

function formatExecution(exec: any) {
  return {
    id: exec.id,
    schema_id: exec.schemaId,
    schema_name: exec.schema?.name ?? null,
    schema_slug: exec.schema?.slug ?? null,
    schema_version: exec.schemaVersion,
    provider: exec.provider,
    model: exec.model,
    status: exec.status,
    attempts: exec.attempts,
    latency_ms: exec.latencyMs,
    tokens_used: exec.tokensUsed,
    input_prompt: exec.inputPrompt,
    output: exec.output,
    validation_errors: exec.validationErrors,
    retry_log: exec.retryLog,
    error_message: exec.errorMessage,
    created_at: exec.createdAt.toISOString(),
  }
}
