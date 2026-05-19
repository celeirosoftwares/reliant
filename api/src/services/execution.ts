import { callLLM, Provider } from '../lib/llm.js'
import { dispatchWebhooks, WebhookEvent } from './webhook.js'
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
  providerUsed: string
  modelUsed: string
  schemaVersion: number
}

interface ProviderKeyRow {
  encrypted_key: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}

// Default models for fallback providers
const DEFAULT_MODELS: Record<string, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
  groq: 'llama-3.3-70b-versatile',
  mistral: 'mistral-small-latest',
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

async function tryProvider(
  provider: Provider,
  model: string,
  userId: string,
  prompt: string,
  schemaDefinition: object,
  systemPromptOverride: string | null,
  maxRetries: number
): Promise<{ output: unknown; tokensUsed: number; attempts: number; errors: string[] } | null> {
  const providerKey = await getUserProviderKey(userId, provider)
  if (!providerKey) {
    console.log(`No key for provider ${provider}, skipping`)
    return null
  }

  const baseSystemPrompt = systemPromptOverride || buildSystemPrompt(schemaDefinition)
  let lastErrors: string[] = []
  let totalTokens = 0
  let attempts = 0

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    attempts = attempt
    try {
      const systemPrompt = attempt === 1
        ? baseSystemPrompt
        : buildRetrySystemPrompt(schemaDefinition, lastErrors, attempt, maxRetries)

      const temperature = attempt === 1 ? 0.2 : attempt === 2 ? 0.1 : 0.0

      const llmResponse = await callLLM({
        provider,
        model,
        systemPrompt,
        userPrompt: prompt,
        temperature,
        apiKey: providerKey,
      })

      totalTokens += llmResponse.tokensUsed

      const parsed = parseJsonOutput(llmResponse.content)
      if (!parsed) {
        lastErrors = ['Output is not valid JSON']
        continue
      }

      const validation = await validateOutput(parsed, schemaDefinition)
      if (validation.valid) {
        return { output: parsed, tokensUsed: totalTokens, attempts, errors: [] }
      }
      lastErrors = validation.errors
    } catch (err: any) {
      lastErrors = [`LLM call failed: ${err.message}`]
      console.error(`Provider ${provider} attempt ${attempt} failed:`, err.message)
    }
  }

  return { output: null, tokensUsed: totalTokens, attempts, errors: lastErrors }
}

export async function executeWithReliability(opts: ExecuteOptions): Promise<ExecuteResult> {
  const startTime = Date.now()
  const maxRetries = opts.maxRetries ?? 3

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

  // Build provider chain: primary + fallbacks
  const fallbackProviders = (schema.fallbackProviders as string[] | null) || []
  const providerChain: Array<{ provider: Provider; model: string }> = [
    { provider: opts.provider as Provider, model: opts.model },
    ...fallbackProviders.map(p => ({ provider: p as Provider, model: DEFAULT_MODELS[p] || 'gpt-4o-mini' })),
  ]

  let finalOutput: unknown = null
  let totalTokens = 0
  let totalAttempts = 0
  let status: 'SUCCESS' | 'FALLBACK' | 'FAILED' = 'FAILED'
  let providerUsed = opts.provider
  let modelUsed = opts.model
  let lastErrors: string[] = []

  for (let pi = 0; pi < providerChain.length; pi++) {
    const { provider, model } = providerChain[pi]
    console.log(`Trying provider ${pi + 1}/${providerChain.length}: ${provider}`)

    const result = await tryProvider(
      provider,
      model,
      opts.userId,
      opts.prompt,
      schemaDefinition,
      systemPromptOverride,
      maxRetries
    )

    if (!result) continue // No key for this provider

    totalTokens += result.tokensUsed
    totalAttempts += result.attempts
    lastErrors = result.errors

    if (result.output !== null) {
      finalOutput = result.output
      providerUsed = provider
      modelUsed = model
      status = pi === 0 ? 'SUCCESS' : 'FALLBACK'
      break
    }
  }

  // Use safe fallback if all providers failed
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
        provider: providerUsed,
        model: modelUsed,
        status,
        attempts: totalAttempts,
        latencyMs,
        tokensUsed: totalTokens,
        inputPrompt: opts.prompt,
        output: finalOutput as any ?? undefined,
        validationErrors: lastErrors.length > 0 ? lastErrors : undefined,
      },
    })
    executionId = execution.id
  } catch (err: any) {
    console.error('Failed to log execution:', err.message)
  }

  // Dispatch webhooks (fire and forget)
  const webhookEvent: WebhookEvent = status === 'SUCCESS'
    ? 'execution.success'
    : status === 'FALLBACK'
    ? 'execution.fallback'
    : 'execution.failed'

  dispatchWebhooks(opts.userId, webhookEvent, {
    execution_id: executionId,
    schema_id: opts.schemaId,
    provider: providerUsed,
    model: modelUsed,
    attempts: totalAttempts,
    latency_ms: latencyMs,
    status,
  })

  return {
    success: status === 'SUCCESS',
    output: finalOutput,
    executionId,
    attempts: totalAttempts,
    latencyMs,
    tokensUsed: totalTokens,
    status,
    providerUsed,
    modelUsed,
    schemaVersion: schema.version,
  }
}
