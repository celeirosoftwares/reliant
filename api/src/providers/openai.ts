// src/providers/openai.ts — OpenAI Provider
import OpenAI from 'openai'
import type { LLMProvider, LLMRequest, LLMResponse } from './base.js'

export class OpenAIProvider implements LLMProvider {
  name = 'openai'
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now()

    const response = await this.client.chat.completions.create({
      model: request.model,
      temperature: request.temperature ?? 0.1,
      max_tokens: request.maxTokens ?? 4096,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
    })

    const latencyMs = Date.now() - start
    const content = response.choices[0]?.message?.content ?? ''
    const tokensUsed = response.usage?.total_tokens ?? 0

    return {
      content,
      tokensUsed,
      model: response.model,
      latencyMs,
    }
  }
}
