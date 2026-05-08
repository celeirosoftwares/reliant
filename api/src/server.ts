// src/server.ts — Reliant API Entry Point
import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { schemasRoutes } from './routes/schemas.js'
import { executeRoutes } from './routes/execute.js'
import { executionsRoutes } from './routes/executions.js'
import { metricsRoutes } from './routes/metrics.js'
import { projectsRoutes } from './routes/projects.js'
import { analyticsRoutes } from './routes/analytics.js'

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
})

async function start() {
  await server.register(cors, { origin: true, credentials: true })

  await server.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000'),
    keyGenerator: (req) => req.headers['x-reliant-key'] as string || req.ip,
  })

  server.get('/health', async () => ({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }))

  await server.register(projectsRoutes, { prefix: '/projects' })
  await server.register(schemasRoutes, { prefix: '/schemas' })
  await server.register(executeRoutes)
  await server.register(executionsRoutes, { prefix: '/executions' })
  await server.register(metricsRoutes, { prefix: '/metrics' })
  await server.register(analyticsRoutes, { prefix: '/analytics' })

  const port = parseInt(process.env.PORT ?? '3100')
  const host = process.env.HOST ?? '0.0.0.0'
  await server.listen({ port, host })
  console.log(`\n  🛡️  Reliant API running on http://${host}:${port}\n`)
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
