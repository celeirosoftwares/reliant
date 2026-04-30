// src/routes/projects.ts — Project management routes
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { generateApiKey } from '../utils/api-key.js'

export async function projectsRoutes(server: FastifyInstance) {
  // Create a new project (public — no auth needed)
  server.post('/', async (request, reply) => {
    const { name } = request.body as { name?: string }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Project name is required',
      })
    }

    const apiKey = generateApiKey()

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        apiKey,
      },
    })

    return reply.status(201).send({
      id: project.id,
      name: project.name,
      api_key: project.apiKey,
      created_at: project.createdAt.toISOString(),
      message: 'Store your API key securely — it will not be shown again.',
    })
  })
}
