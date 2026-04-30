// src/middleware/auth.ts — API Key authentication middleware
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma.js'

declare module 'fastify' {
  interface FastifyRequest {
    project?: {
      id: string
      name: string
      apiKey: string
    }
  }
}

/**
 * Authenticates requests using the X-Reliant-Key header.
 * Attaches the project to the request object.
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-reliant-key'] as string | undefined

  if (!apiKey) {
    return reply.status(401).send({
      error: 'Authentication required',
      message: 'Provide your API key in the X-Reliant-Key header',
    })
  }

  try {
    const project = await prisma.project.findUnique({
      where: { apiKey },
      select: { id: true, name: true, apiKey: true },
    })

    if (!project) {
      return reply.status(401).send({
        error: 'Invalid API key',
        message: 'The provided API key is not valid',
      })
    }

    request.project = project
  } catch (err) {
    request.log.error(err, 'Auth middleware error')
    return reply.status(500).send({
      error: 'Internal error',
      message: 'Failed to verify authentication',
    })
  }
}
