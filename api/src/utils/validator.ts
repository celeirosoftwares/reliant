// src/utils/validator.ts — JSON Schema validation using Ajv
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false,
})
addFormats(ajv)

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  path: string
  message: string
  keyword: string
  params: Record<string, unknown>
}

/**
 * Validates data against a JSON Schema definition.
 */
export function validateAgainstSchema(data: unknown, schema: object): ValidationResult {
  const validate = ajv.compile(schema)
  const valid = validate(data)

  if (valid) {
    return { valid: true, errors: [] }
  }

  const errors: ValidationError[] = (validate.errors ?? []).map((err) => ({
    path: err.instancePath || '/',
    message: err.message ?? 'Unknown validation error',
    keyword: err.keyword,
    params: err.params as Record<string, unknown>,
  }))

  return { valid: false, errors }
}

/**
 * Validates that a given definition is a valid JSON Schema.
 */
export function isValidJsonSchema(definition: unknown): boolean {
  try {
    ajv.compile(definition as object)
    return true
  } catch {
    return false
  }
}

/**
 * Attempts to parse a string as JSON.
 * Handles cases where LLMs wrap JSON in markdown code blocks.
 */
export function parseJsonSafe(text: string): { success: boolean; data?: unknown; error?: string } {
  // Strip markdown code block wrappers if present
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7)
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3)
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3)
  }
  cleaned = cleaned.trim()

  try {
    const data = JSON.parse(cleaned)
    return { success: true, data }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to parse JSON',
    }
  }
}
