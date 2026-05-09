import { callLLM, Provider } from '../lib/llm.js'
import { prisma } from '../lib/prisma.js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface ExecuteOptions {
  prompt: string
  schemaId: string
  provider: Provider
  model: string
  projectId: string
  userId: string
  maxRetries?: number
}

export interface ExecuteResult {
  success: boolean
  output: unknown
  executionId: string
  attempts: number
  latencyMs: number
  tokensUsed: number
  status: 'SUCCESS' | 'FALLBACK' | 'FAILED'
}

interface ProviderKeyRow {
  encrypted_key: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}

async function getUserProviderKey(userId: string, provider: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/provider_keys?user_id=eq.${userId}&provider=eq.${provider}&is_active=eq.true&select=encrypted_key`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    )
    if (!res.ok) return null
    const data = await res.json() as ProviderKeyRow[]
    if (!data || data.length === 0) return null
    return data[0].encrypted_key
  } catch {
    return null
  }
}

async function validateOutput(output: unknown, schema: unknown): Promise<ValidationResult> {
  try {
    const { default: Ajv } = await import('ajv')
    const { default: addFormats } = await import('ajv-formats')
    const ajv = new Ajv({ allErrors: true })
    addFormats(ajv)
    const validate = ajv.compile(schema as object)
    const valid = validate(output)
    if (valid) return { valid: true, errors: [] }
    const errors = (validate.errors || []).map((e: any) => `${e.instancePath} ${e.message}`.trim())
    return { valid: false, errors }
  } catch (err: any) {
    return { valid: false, errors: [`Validation failed: ${err.message}`] }
  }
}

function parseJsonOutput(content: string): unknown | null {
  try {
    return JSON.parse(content)
  } catch {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (match) {
      try { return JSON.parse(match[1]) } catch {}
    }
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]) } catch {}
    }
    return null
  }
}

function buildSystemPrompt(schema: object): string {
  return `You are a data extraction assistant. You MUST respond with ONLY a valid JSON object that strictly follows this JSON Schema:

${JSON.stringify(schema, null, 2)}

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code blocks
- Every required field must be present
- Data types must match exactly
- If information is not available, use null for optional fields`
}

function buildRetrySystemPrompt(schema: object, previousErrors: string[], attempt: number, maxRetries: number): string {
  return `You are a data extraction assistant. Your previous response had validation errors.

Validation errors from previous attempt:
${previousErrors.map((e) => `- ${e}`).join('\n')}

You MUST respond with ONLY a valid JSON object that strictly follows this JSON Schema:

${JSON.stringify(schema, null, 2)}

${attempt === maxRetries ? 'CRITICAL: This is your final attempt. Return the most minimal valid JSON possible.' : ''}

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code blocks
- Fix ALL the validation errors listed above
- Every required field must be present`
}

export async function executeWithReliability(opts: ExecuteOptions): Promise<ExecuteResult> {
  const startTime = Date.now()
  const maxRetries = opts.maxRetries ?? 3

  // Get provider key
  const providerKey = await getUserProviderKey(opts.userId, opts.provider)
  if (!providerKey) {
    throw new Error(`No API key configured for provider "${opts.provider}". Add your key in Providers settings.`)
  }

  // Get schema
  const schema = await prisma.schema.findFirst({
    where: { id: opts.schemaId, projectId: opts.projectId },
    orderBy: { version: 'desc' },
  })

  if (!schema) {
    throw new Error(`Schema ${opts.schemaId} not found in project ${opts.projectId}`)
  }

  const schemaDefinition = schema.definition as object
  const systemPromptOverride = (schema as any).systemPrompt as string | null
  const baseSystemPrompt = systemPromptOverride || buildSystemPrompt(schemaDefinition)

  let lastValidationErrors: string[] = []
  let totalTokens = 0
  let attempts = 0
  let finalOutput: unknown = null
  let status: 'SUCCESS' | 'FALLBACK' | 'FAILED' = 'FAILED'

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    attempts = attempt
    try {
      const systemPrompt = attempt === 1
        ? baseSystemPrompt
        : buildRetrySystemPrompt(schemaDefinition, lastValidationErrors, attempt, maxRetries)

      const temperature = attempt === 1 ? 0.2 : attempt === 2 ? 0.1 : 0.0

      const llmResponse = await callLLM({
        provider: opts.provider,
        model: opts.model,
        systemPrompt,
        userPrompt: opts.prompt,
        temperature,
        apiKey: providerKey,
      })

      totalTokens += llmResponse.tokensUsed

      const parsed = parseJsonOutput(llmResponse.content)
      if (!parsed) {
        lastValidationErrors = ['Output is not valid JSON']
        continue
      }

      const validation = await validateOutput(parsed, schemaDefinition)
      if (validation.valid) {
        finalOutput = parsed
        status = 'SUCCESS'
        break
      }

      lastValidationErrors = validation.errors
    } catch (err: any) {
      lastValidationErrors = [`LLM call failed: ${err.message}`]
    }
  }

  // Use fallback if failed
  if (status === 'FAILED' && schema.safeFallback) {
    finalOutput = schema.safeFallback
    status = 'FALLBACK'
  }

  const latencyMs = Date.now() - startTime

  // Log execution
  let executionId = 'unknown'
  try {
    const execution = await prisma.execution.create({
      data: {
        projectId: opts.projectId,
        schemaId: opts.schemaId,
        schemaVersion: schema.version,
        provider: opts.provider,
        model: opts.model,
        status,
        attempts,
        latencyMs,
        tokensUsed: totalTokens,
        inputPrompt: opts.prompt,
        output: finalOutput as any ?? undefined,
        validationErrors: lastValidationErrors.length > 0 ? lastValidationErrors : undefined,
      },
    })
    executionId = execution.id
  } catch (err: any) {
    console.error('Failed to log execution:', err.message)
  }

  return {
    success: status === 'SUCCESS',
    output: finalOutput,
    executionId,
    attempts,
    latencyMs,
    tokensUsed: totalTokens,
    status,
  }
}
