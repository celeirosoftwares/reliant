// src/services/retry-orchestrator.ts — Intelligent retry logic
import type { LLMProvider, LLMRequest, LLMResponse } from '../providers/base.js'
import { validateAgainstSchema, parseJsonSafe, type ValidationError } from '../utils/validator.js'

export interface RetryConfig {
  maxRetries: number
  fallbackEnabled: boolean
  safeFallback?: unknown
}

export interface AttemptResult {
  attempt: number
  success: boolean
  output?: unknown
  rawContent: string
  validationErrors?: ValidationError[]
  parseError?: string
  latencyMs: number
  tokensUsed: number
}

export interface RetryResult {
  success: boolean
  status: 'success' | 'failed' | 'fallback'
  output: unknown
  attempts: AttemptResult[]
  totalLatencyMs: number
  totalTokensUsed: number
  validationErrors?: ValidationError[]
}

/**
 * Orchestrates retries with escalating strategies:
 * 1. Normal call
 * 2. Append validation errors to prompt
 * 3. Simplified prompt with lower temperature
 * 4. Return safe_fallback if configured
 */
export async function executeWithRetry(
  provider: LLMProvider,
  baseRequest: LLMRequest,
  schemaDefinition: object,
  config: RetryConfig,
): Promise<RetryResult> {
  const attempts: AttemptResult[] = []
  let totalTokensUsed = 0
  const startTotal = Date.now()

  const maxAttempts = Math.min(config.maxRetries + 1, 4) // cap at 4

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const request = buildRequest(baseRequest, attempt, attempts)

    try {
      const response = await provider.call(request)
      totalTokensUsed += response.tokensUsed

      // Try to parse JSON from response
      const parsed = parseJsonSafe(response.content)

      if (!parsed.success) {
        attempts.push({
          attempt,
          success: false,
          rawContent: response.content,
          parseError: parsed.error,
          latencyMs: response.latencyMs,
          tokensUsed: response.tokensUsed,
        })
        continue
      }

      // Validate against schema
      const validation = validateAgainstSchema(parsed.data, schemaDefinition)

      if (validation.valid) {
        attempts.push({
          attempt,
          success: true,
          output: parsed.data,
          rawContent: response.content,
          latencyMs: response.latencyMs,
          tokensUsed: response.tokensUsed,
        })

        return {
          success: true,
          status: 'success',
          output: parsed.data,
          attempts,
          totalLatencyMs: Date.now() - startTotal,
          totalTokensUsed,
        }
      }

      // Validation failed — record and continue
      attempts.push({
        attempt,
        success: false,
        output: parsed.data,
        rawContent: response.content,
        validationErrors: validation.errors,
        latencyMs: response.latencyMs,
        tokensUsed: response.tokensUsed,
      })
    } catch (err) {
      attempts.push({
        attempt,
        success: false,
        rawContent: '',
        parseError: err instanceof Error ? err.message : 'Provider call failed',
        latencyMs: 0,
        tokensUsed: 0,
      })
    }
  }

  // All attempts failed — check fallback
  const lastAttempt = attempts[attempts.length - 1]

  if (config.fallbackEnabled && config.safeFallback !== undefined) {
    return {
      success: true,
      status: 'fallback',
      output: config.safeFallback,
      attempts,
      totalLatencyMs: Date.now() - startTotal,
      totalTokensUsed,
      validationErrors: lastAttempt?.validationErrors,
    }
  }

  return {
    success: false,
    status: 'failed',
    output: null,
    attempts,
    totalLatencyMs: Date.now() - startTotal,
    totalTokensUsed,
    validationErrors: lastAttempt?.validationErrors,
  }
}

/**
 * Builds the request for each attempt with escalating strategies.
 */
function buildRequest(
  base: LLMRequest,
  attempt: number,
  previousAttempts: AttemptResult[],
): LLMRequest {
  if (attempt === 1) {
    return { ...base }
  }

  const lastAttempt = previousAttempts[previousAttempts.length - 1]

  if (attempt === 2 && lastAttempt) {
    // Strategy 2: Append validation errors
    const errorContext = lastAttempt.validationErrors
      ? lastAttempt.validationErrors.map((e) => `- ${e.path}: ${e.message}`).join('\n')
      : lastAttempt.parseError ?? 'Output was not valid JSON'

    return {
      ...base,
      userPrompt: `${base.userPrompt}

---
IMPORTANT: Your previous response was not in the correct format.
Errors found:
${errorContext}

Please return ONLY a valid JSON object following the schema exactly. No explanations, no markdown.`,
    }
  }

  if (attempt >= 3) {
    // Strategy 3: Simplified prompt with lower temperature
    return {
      ...base,
      temperature: 0,
      userPrompt: `${base.userPrompt}

---
CRITICAL: Return ONLY a raw JSON object. No text before or after. No markdown code blocks. Follow the schema exactly.`,
    }
  }

  return { ...base }
}
