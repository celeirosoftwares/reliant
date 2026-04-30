// prisma/seed.ts — Seeds the database with a demo project and schemas
import { PrismaClient } from '@prisma/client'
import { generateApiKey } from '../src/utils/api-key.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Create demo project
  const apiKey = generateApiKey()
  const project = await prisma.project.create({
    data: {
      name: 'Demo Project',
      apiKey,
    },
  })
  console.log(`✅ Project created: ${project.name}`)
  console.log(`🔑 API Key: ${apiKey}\n`)

  // Create sample schemas
  const contactSchema = await prisma.schema.create({
    data: {
      projectId: project.id,
      name: 'Contact Extraction',
      slug: 'contact-extraction',
      version: 1,
      description: 'Extracts contact information from unstructured text',
      definition: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', description: 'Full name of the person' },
          email: { type: 'string', format: 'email', description: 'Email address' },
          phone: { type: 'string', description: 'Phone number' },
          company: { type: 'string', description: 'Company name' },
        },
        additionalProperties: false,
      },
      safeFallback: {
        name: 'Unknown',
        email: 'unknown@example.com',
        phone: null,
        company: null,
      },
    },
  })
  console.log(`✅ Schema created: ${contactSchema.name} (v${contactSchema.version})`)

  const sentimentSchema = await prisma.schema.create({
    data: {
      projectId: project.id,
      name: 'Sentiment Analysis',
      slug: 'sentiment-analysis',
      version: 1,
      description: 'Analyzes sentiment of a given text',
      definition: {
        type: 'object',
        required: ['sentiment', 'score', 'summary'],
        properties: {
          sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral', 'mixed'] },
          score: { type: 'number', minimum: -1, maximum: 1 },
          summary: { type: 'string', maxLength: 200 },
          keywords: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
      safeFallback: {
        sentiment: 'neutral',
        score: 0,
        summary: 'Unable to analyze sentiment',
        keywords: [],
      },
    },
  })
  console.log(`✅ Schema created: ${sentimentSchema.name} (v${sentimentSchema.version})`)

  console.log('\n🎉 Seed complete!')
  console.log(`\nUse this API key to get started:\n  X-Reliant-Key: ${apiKey}\n`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
