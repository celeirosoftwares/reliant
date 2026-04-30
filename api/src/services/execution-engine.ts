// src/services/execution-engine.ts — Core execution engine
import { prisma } from '../lib/prisma.js'
import { getProvider } from '../providers/index.js'
import { executeWithRetry, type RetryConfig } from './retry-orchestrator.js'
import type { LLMRequest } from '../providers/base.js'

export interface ExecuteInput {
  projectId: string
  prompt: string
  schemaId: string
  provider: string
  model: string
  options?: {
    max_retries?: number
    temperature?: number
    max_tokens?: number
    fallback?: {
      enabled?: boolean
    }
  }
}

export interface ExecuteOutput {
  success: boolean
  output: unknown
  metadata: {
    execution_id: string
    status: 'success' | 'failed' | 'fallback'
    attempts: number
    latency_ms: number
    model_used: string
    tokens_used: number
    schema_version: number
    validation_errors?: Array<{ path: string; message: string }>
  }
}

/**
 * Main execution flow:
 * 1. Fetch schema from registry
 * 2. Build system prompt with schema instructions
 * 3. Call LLM via Retry Orchestrator
 * 4. Record execution in Observability Engine
 * 5. Return result
 */
export async function execute(input: ExecuteInput): Promise<ExecuteOutput> {
  const startTime = Date.now()

  // 1. Fetch schema
  const schema = await prisma.schema.findFirst({
    where: {
      id: input.schemaId,
      projectId: input.projectId,
      isActive: true,
    },
    orderBy: { version: 'desc' },
  })

  if (!schema) {
    throw new ExecutionError('Schema not found or inactive', 'SCHEMA_NOT_FOUND')
  }

  // 2. Get LLM provider
  const provider = getProvider(input.provider)

  // 3. Build system prompt
  const systemPrompt = buildSystemPrompt(schema.definition as object, schema.name)

  const llmRequest: LLMRequest = {
    model: input.model,
    systemPrompt,
    userPrompt: input.prompt,
    temperature: input.options?.temperature ?? 0.1,
    maxTokens: input.options?.max_tokens ?? 4096,
  }

  // 4. Execute with retry
  const retryConfig: RetryConfig = {
    maxRetries: input.options?.max_retries ?? 3,
    fallbackEnabled: input.options?.fallback?.enabled ?? false,
    safeFallback: schema.safeFallback,
  }

  const result = await executeWithRetry(provider, llmRequest, schema.definition as object, retryConfig)

  // 5. Record execution
  const execution = await prisma.execution.create({
    data: {
      projectId: input.projectId,
      schemaId: schema.id,
      schemaVersion: schema.version,
      provider: input.provider,
      model: input.model,
      status: result.status,
      attempts: result.attempts.length,
      latencyMs: result.totalLatencyMs,
      tokensUsed: result.totalTokensUsed,
      inputPrompt: input.prompt,
      output: result.output as any,
      validationErrors: result.validationErrors as any ?? null,
      retryLog: result.attempts.map((a) => ({
        attempt: a.attempt,
        success: a.success,
        latencyMs: a.latencyMs,
        tokensUsed: a.tokensUsed,
        parseError: a.parseError,
        validationErrors: a.validationErrors,
      })) as any,
    },
  })

  return {
    success: result.success,
    output: result.output,
    metadata: {
      execution_id: execution.id,
      status: result.status,
      attempts: result.attempts.length,
      latency_ms: result.totalLatencyMs,
      model_used: input.model,
      tokens_used: result.totalTokensUsed,
      schema_version: schema.version,
      validation_errors: result.validationErrors?.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    },
  }
}

/**
 * Builds the system prompt that instructs the LLM to output valid JSON.
 */
function buildSystemPrompt(schemaDefinition: object, schemaName: string): string {
  return `You are a structured data extraction assistant. Your task is to analyze the user's input and return a JSON object that strictly conforms to the following schema.

Schema Name: ${schemaName}
JSON Schema:
${JSON.stringify(schemaDefinition, null, 2)}

Rules:
1. Return ONLY a valid JSON object. No explanations, no markdown formatting, no code blocks.
2. Every required field must be present.
3. Field types must match the schema exactly.
4. If a field is optional and you cannot determine its value, omit it or use null.
5. Do not add fields that are not in the schema.`
}

export class ExecutionError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.code = code
    this.name = 'ExecutionError'
  }
}
