// src/routes/schemas.ts — Schema Registry CRUD routes
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'
import { isValidJsonSchema } from '../utils/validator.js'

export async function schemasRoutes(server: FastifyInstance) {
  // All schema routes require authentication
  server.addHook('onRequest', authMiddleware)

  // Create a new schema
  server.post('/', async (request, reply) => {
    const { name, slug, description, definition, safe_fallback, system_prompt } = request.body as {
      name?: string
      slug?: string
      description?: string
      definition?: unknown
      safe_fallback?: unknown
      system_prompt?: string
    }

    if (!name || !slug || !definition) {
      return reply.status(400).send({
        error: 'Validation error',
        message: 'name, slug, and definition are required',
      })
    }

    if (typeof slug !== 'string' || !/^[a-z0-9_-]+$/.test(slug)) {
      return reply.status(400).send({
        error: 'Validation error',
        message: 'slug must contain only lowercase letters, numbers, hyphens, and underscores',
      })
    }

    if (!isValidJsonSchema(definition)) {
      return reply.status(400).send({
        error: 'Invalid schema',
        message: 'The provided definition is not a valid JSON Schema',
      })
    }

    const existing = await prisma.schema.findFirst({
      where: { projectId: request.project!.id, slug },
      orderBy: { version: 'desc' },
    })

    const version = existing ? existing.version + 1 : 1

    const schema = await prisma.schema.create({
      data: {
        projectId: request.project!.id,
        name: name.trim(),
        slug,
        version,
        description: description?.trim() ?? null,
        definition: definition as any,
        safeFallback: safe_fallback as any ?? null,
        systemPrompt: system_prompt?.trim() ?? null,
      },
    })

    return reply.status(201).send(formatSchema(schema))
  })

  // List schemas (latest version only)
  server.get('/', async (request) => {
    const schemas = await prisma.schema.findMany({
      where: { projectId: request.project!.id, isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    const latestBySlug = new Map<string, typeof schemas[0]>()
    for (const schema of schemas) {
      const existing = latestBySlug.get(schema.slug)
      if (!existing || schema.version > existing.version) {
        latestBySlug.set(schema.slug, schema)
      }
    }

    return { schemas: Array.from(latestBySlug.values()).map(formatSchema) }
  })

  // Get schema by ID
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const schema = await prisma.schema.findFirst({
      where: { id: request.params.id, projectId: request.project!.id },
    })

    if (!schema) {
      return reply.status(404).send({ error: 'Schema not found' })
    }

    return formatSchema(schema)
  })

  // Update schema (creates new version)
  server.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const existing = await prisma.schema.findFirst({
      where: { id: request.params.id, projectId: request.project!.id },
    })

    if (!existing) {
      return reply.status(404).send({ error: 'Schema not found' })
    }

    const { name, description, definition, safe_fallback, system_prompt } = request.body as {
      name?: string
      description?: string
      definition?: unknown
      safe_fallback?: unknown
      system_prompt?: string
    }

    if (definition && !isValidJsonSchema(definition)) {
      return reply.status(400).send({
        error: 'Invalid schema',
        message: 'The provided definition is not a valid JSON Schema',
      })
    }

    const latest = await prisma.schema.findFirst({
      where: { projectId: request.project!.id, slug: existing.slug },
      orderBy: { version: 'desc' },
    })

    const newVersion = (latest?.version ?? 0) + 1

    const schema = await prisma.schema.create({
      data: {
        projectId: request.project!.id,
        name: (name ?? existing.name).trim(),
        slug: existing.slug,
        version: newVersion,
        description: description?.trim() ?? existing.description,
        definition: (definition as any) ?? existing.definition,
        safeFallback: safe_fallback !== undefined ? (safe_fallback as any) : existing.safeFallback,
        systemPrompt: system_prompt !== undefined ? (system_prompt?.trim() ?? null) : (existing as any).systemPrompt,
      },
    })

    return formatSchema(schema)
  })

  // List versions of a schema
  server.get<{ Params: { id: string } }>('/:id/versions', async (request, reply) => {
    const schema = await prisma.schema.findFirst({
      where: { id: request.params.id, projectId: request.project!.id },
    })

    if (!schema) {
      return reply.status(404).send({ error: 'Schema not found' })
    }

    const versions = await prisma.schema.findMany({
      where: { projectId: request.project!.id, slug: schema.slug },
      orderBy: { version: 'desc' },
    })

    return { versions: versions.map(formatSchema) }
  })

  // Delete schema (soft delete — deactivate)
  server.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const schema = await prisma.schema.findFirst({
      where: { id: request.params.id, projectId: request.project!.id },
    })

    if (!schema) {
      return reply.status(404).send({ error: 'Schema not found' })
    }

    await prisma.schema.updateMany({
      where: { projectId: request.project!.id, slug: schema.slug },
      data: { isActive: false },
    })

    return { success: true, message: 'Schema deactivated' }
  })
}

function formatSchema(schema: any) {
  return {
    id: schema.id,
    name: schema.name,
    slug: schema.slug,
    version: schema.version,
    description: schema.description,
    definition: schema.definition,
    safe_fallback: schema.safeFallback,
    system_prompt: schema.systemPrompt ?? null,
    is_active: schema.isActive,
    created_at: schema.createdAt.toISOString(),
  }
}