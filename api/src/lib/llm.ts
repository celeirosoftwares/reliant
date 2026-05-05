export type Provider = 'anthropic' | 'openai' | 'gemini' | 'groq' | 'mistral'

export interface LLMRequest {
  provider: Provider
  model: string
  systemPrompt: string
  userPrompt: string
  temperature?: number
  apiKey: string
}

export interface LLMResponse {
  content: string
  tokensUsed: number
}

export async function callLLM(req: LLMRequest): Promise<LLMResponse> {
  switch (req.provider) {
    case 'anthropic': return callAnthropic(req)
    case 'openai': return callOpenAI(req)
    case 'gemini': return callGemini(req)
    case 'groq': return callGroq(req)
    case 'mistral': return callMistral(req)
    default: throw new Error(`Unsupported provider: ${req.provider}`)
  }
}

async function callAnthropic(req: LLMRequest): Promise<LLMResponse> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: req.apiKey })

  const response = await client.messages.create({
    model: req.model,
    max_tokens: 4096,
    temperature: req.temperature ?? 0.2,
    system: req.systemPrompt,
    messages: [{ role: 'user', content: req.userPrompt }],
  })

  const content = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')

  return {
    content,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  }
}

async function callOpenAI(req: LLMRequest): Promise<LLMResponse> {
  const OpenAI = (await import('openai')).default
  const client = new OpenAI({ apiKey: req.apiKey })

  const response = await client.chat.completions.create({
    model: req.model,
    temperature: req.temperature ?? 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: req.systemPrompt },
      { role: 'user', content: req.userPrompt },
    ],
  })

  return {
    content: response.choices[0]?.message?.content || '',
    tokensUsed: response.usage?.total_tokens || 0,
  }
}

async function callGemini(req: LLMRequest): Promise<LLMResponse> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(req.apiKey)
  const model = genAI.getGenerativeModel({ model: req.model })

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${req.systemPrompt}\n\n${req.userPrompt}` }] }],
    generationConfig: { temperature: req.temperature ?? 0.2 },
  })

  const content = result.response.text()
  const usage = result.response.usageMetadata

  return {
    content,
    tokensUsed: (usage?.promptTokenCount || 0) + (usage?.candidatesTokenCount || 0),
  }
}

async function callGroq(req: LLMRequest): Promise<LLMResponse> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${req.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model,
      temperature: req.temperature ?? 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: req.systemPrompt },
        { role: 'user', content: req.userPrompt },
      ],
    }),
  })

  const data = await response.json() as { choices: Array<{ message: { content: string } }>; usage: { total_tokens: number }; error?: { message: string } }
  if (!response.ok) throw new Error(data.error?.message || 'Groq API error')

  return {
    content: data.choices[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens || 0,
  }
}

async function callMistral(req: LLMRequest): Promise<LLMResponse> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${req.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model,
      temperature: req.temperature ?? 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: req.systemPrompt },
        { role: 'user', content: req.userPrompt },
      ],
    }),
  })

  const data = await response.json() as { choices: Array<{ message: { content: string } }>; usage: { total_tokens: number }; message?: string }
  if (!response.ok) throw new Error(data.message || 'Mistral API error')

  return {
    content: data.choices[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens || 0,
  }
}
