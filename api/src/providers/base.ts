// src/providers/base.ts — Base LLM Provider interface

export interface LLMRequest {
  model: string
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
}

export interface LLMResponse {
  content: string
  tokensUsed: number
  model: string
  latencyMs: number
}

export interface LLMProvider {
  name: string
  call(request: LLMRequest): Promise<LLMResponse>
}
