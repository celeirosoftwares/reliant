// src/providers/index.ts — Provider registry
import type { LLMProvider } from './base.js'
import { OpenAIProvider } from './openai.js'
import { AnthropicProvider } from './anthropic.js'
import { GeminiProvider } from './gemini.js'

const providers = new Map<string, LLMProvider>()

export function getProvider(name: string): LLMProvider {
  const normalized = name.toLowerCase()

  if (!providers.has(normalized)) {
    switch (normalized) {
      case 'openai':
        providers.set(normalized, new OpenAIProvider())
        break
      case 'anthropic':
        providers.set(normalized, new AnthropicProvider())
        break
      case 'gemini':
      case 'google':
        providers.set(normalized, new GeminiProvider())
        break
      default:
        throw new Error(`Unknown provider: ${name}. Supported: openai, anthropic, gemini`)
    }
  }

  return providers.get(normalized)!
}

export const SUPPORTED_PROVIDERS = ['openai', 'anthropic', 'gemini'] as const
export type SupportedProvider = typeof SUPPORTED_PROVIDERS[number]
