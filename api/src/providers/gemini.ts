// src/providers/gemini.ts — Google Gemini Provider
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { LLMProvider, LLMRequest, LLMResponse } from './base.js'

export class GeminiProvider implements LLMProvider {
  name = 'gemini'
  private client: GoogleGenerativeAI

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '')
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now()

    const model = this.client.getGenerativeModel({
      model: request.model,
      systemInstruction: request.systemPrompt,
      generationConfig: {
        temperature: request.temperature ?? 0.1,
        maxOutputTokens: request.maxTokens ?? 4096,
      },
    })

    const result = await model.generateContent(request.userPrompt)
    const response = result.response

    const latencyMs = Date.now() - start
    const content = response.text()
    const tokensUsed =
      (response.usageMetadata?.promptTokenCount ?? 0) +
      (response.usageMetadata?.candidatesTokenCount ?? 0)

    return {
      content,
      tokensUsed,
      model: request.model,
      latencyMs,
    }
  }
}
