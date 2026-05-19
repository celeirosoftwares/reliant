export interface ReliantConfig {
  apiKey: string
  userId: string
  baseUrl?: string
  timeout?: number
}

export interface ExecuteOptions {
  prompt: string
  schemaId: string
  provider: string
  model: string
  maxRetries?: number
}

export interface ExecuteResult {
  success: boolean
  status: 'SUCCESS' | 'FALLBACK' | 'FAILED'
  output: unknown
  fallback_used: boolean
  metadata: {
    execution_id: string
    schema_version: number
    attempts: number
    latency_ms: number
    tokens_used: number
    provider: string
    model: string
    original_provider: string
    original_model: string
  }
}

export interface BatchOptions {
  prompts: string[]
  schemaId: string
  provider: string
  model: string
  concurrency?: number
  costOptimized?: boolean
  maxRetries?: number
}

export interface BatchResultItem {
  index: number
  success: boolean
  status: string
  output: unknown
  error?: string
  metadata: {
    execution_id?: string
    schema_version?: number
    attempts?: number
    latency_ms?: number
    tokens_used?: number
    provider: string
    model: string
    cost_optimized?: boolean
  }
}

export interface BatchResult {
  success: boolean
  total: number
  summary: {
    success: number
    fallback: number
    failed: number
    success_rate: number
    total_tokens: number
    total_latency_ms: number
    avg_latency_ms: number
  }
  results: BatchResultItem[]
}

export class ReliantError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'ReliantError'
  }
}

export class Reliant {
  private apiKey: string
  private userId: string
  private baseUrl: string
  private timeout: number

  constructor(config: ReliantConfig) {
    if (!config.apiKey) throw new ReliantError('apiKey is required', 0)
    if (!config.userId) throw new ReliantError('userId is required', 0)
    this.apiKey = config.apiKey
    this.userId = config.userId
    this.baseUrl = (config.baseUrl || 'https://reliant-production.up.railway.app').replace(/\/$/, '')
    this.timeout = config.timeout || 120000
  }

  async execute(options: ExecuteOptions): Promise<ExecuteResult> {
    return this.request('POST', '/execute', {
      prompt: options.prompt,
      schema_id: options.schemaId,
      provider: options.provider,
      model: options.model,
      user_id: this.userId,
      options: { max_retries: options.maxRetries },
    })
  }

  async executeBatch(options: BatchOptions): Promise<BatchResult> {
    if (!options.prompts || options.prompts.length === 0) {
      throw new ReliantError('prompts must be a non-empty array', 0)
    }
    if (options.prompts.length > 100) {
      throw new ReliantError('Maximum 100 prompts per batch', 0)
    }

    return this.request('POST', '/execute-batch', {
      prompts: options.prompts,
      schema_id: options.schemaId,
      provider: options.provider,
      model: options.model,
      user_id: this.userId,
      options: {
        concurrency: options.concurrency ?? 3,
        cost_optimized: options.costOptimized ?? false,
        max_retries: options.maxRetries ?? 3,
      },
    })
  }

  async listSchemas(): Promise<any> {
    return this.request('GET', '/schemas')
  }

  async getSchema(id: string): Promise<any> {
    return this.request('GET', `/schemas/${id}`)
  }

  async createSchema(params: {
    name: string
    slug: string
    definition: object
    safeFallback?: object
    description?: string
    systemPrompt?: string
    fallbackProviders?: string[]
  }): Promise<any> {
    return this.request('POST', '/schemas', {
      name: params.name,
      slug: params.slug,
      definition: params.definition,
      safe_fallback: params.safeFallback,
      description: params.description,
      system_prompt: params.systemPrompt,
      fallback_providers: params.fallbackProviders,
    })
  }

  async listExecutions(params?: { limit?: number; status?: string; schemaId?: string }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.status) query.set('status', params.status)
    if (params?.schemaId) query.set('schema_id', params.schemaId)
    return this.request('GET', `/executions?${query.toString()}`)
  }

  async getExecution(id: string): Promise<any> {
    return this.request('GET', `/executions/${id}`)
  }

  async getMetrics(days = 30): Promise<any> {
    return this.request('GET', `/metrics/summary?days=${days}`)
  }

  async getMetricsBySchema(days = 30): Promise<any> {
    return this.request('GET', `/analytics/by-schema?days=${days}`)
  }

  async getMetricsByProvider(days = 30): Promise<any> {
    return this.request('GET', `/analytics/by-provider?days=${days}`)
  }

  private async request(method: string, path: string, body?: object): Promise<any> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Reliant-Key': this.apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new ReliantError(data.message || data.error || 'Unknown error', res.status)
      }
      return data
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export default Reliant
