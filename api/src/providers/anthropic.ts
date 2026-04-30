// src/providers/anthropic.ts — Anthropic Provider
import Anthropic from '@anthropic-ai/sdk'
import type { LLMProvider, LLMRequest, LLMResponse } from './base.js'

export class AnthropicProvider implements LLMProvider {
  name = 'anthropic'
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now()

    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.1,
      system: request.systemPrompt,
      messages: [
        { role: 'user', content: request.userPrompt },
      ],
    })

    const latencyMs = Date.now() - start
    const textBlock = response.content.find((b) => b.type === 'text')
    const content = textBlock?.type === 'text' ? textBlock.text : ''
    const tokensUsed = (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0)

    return {
      content,
      tokensUsed,
      model: response.model,
      latencyMs,
    }
  }
}
