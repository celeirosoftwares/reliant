// src/utils/api-key.ts — API Key generation and validation
import { randomBytes } from 'crypto'

const API_KEY_PREFIX = 'rel_'
const API_KEY_LENGTH = 32

/**
 * Generates a new Reliant API key.
 * Format: rel_ + 32 random hex characters
 * Example: rel_a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5
 */
export function generateApiKey(): string {
  const randomPart = randomBytes(API_KEY_LENGTH / 2).toString('hex')
  return `${API_KEY_PREFIX}${randomPart}`
}

/**
 * Validates the format of an API key.
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length === API_KEY_PREFIX.length + API_KEY_LENGTH
}
