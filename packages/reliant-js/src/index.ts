/**
 * Reliant JS SDK
 * The reliability layer for LLM-powered products
 *
 * @example
 * ```typescript
 * import { Reliant } from 'reliant-js';
 *
 * const reliant = new Reliant({ apiKey: 'rel_...' });
 *
 * const result = await reliant.execute({
 *   prompt: 'Extract contact info from: John Doe, john@example.com',
 *   schemaId: 'sch_contact_extraction',
 *   provider: 'openai',
 *   model: 'gpt-4o',
 * });
 *
 * console.log(result.output);
 * ```
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReliantConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}

export interface ExecuteInput {
  prompt: string
  schemaId: string
  provider: 'openai' | 'anthropic' | 'gemini'
  model: string
  options?: {
    max_retries?: number
    temperature?: number
    max_tokens?: number
    fallback?: { enabled?: boolean }
  }
}

export interface ExecuteResult {
  success: boolean
  output: any
  metadata: {
    execution_id: string
    status: 'success' | 'failed' | 'fallback'
    attempts: number
    latency_ms: number
    model_used: string
    tokens_used: number
    schema_version: number
    validation_errors?: Array<{ path: string; message: string }>
  }
}

export interface SchemaInput {
  name: string
  slug: string
  description?: string
  definition: object
  safe_fallback?: object
}

export interface SchemaResult {
  id: string
  name: string
  slug: string
  version: number
  description: string | null
  definition: object
  safe_fallback: object | null
  is_active: boolean
  created_at: string
}

export interface PaginatedExecutions {
  executions: any[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface MetricsSummary {
  period_days: number
  total_executions: number
  success_rate: number
  status_breakdown: {
    success: number
    failed: number
    fallback: number
  }
  avg_latency_ms: number
  avg_attempts: number
  total_tokens: number
  daily: Array<{
    date: string
    total: number
    success: number
    failed: number
    tokens: number
  }>
}

// ─── Client ───────────────────────────────────────────────────────────────────

export class Reliant {
  private apiKey: string
  private baseUrl: string
  private timeout: number

  constructor(config: ReliantConfig) {
    if (!config.apiKey) {
      throw new Error('Reliant: apiKey is required')
    }

    this.apiKey = config.apiKey
    this.baseUrl = (config.baseUrl ?? 'https://api.reliant.dev').replace(/\/$/, '')
    this.timeout = config.timeout ?? 120_000 // 2 min default for LLM calls
  }

  // ─── Execute ──────────────────────────────────────────────────────────────

  async execute(input: ExecuteInput): Promise<ExecuteResult> {
    return this.request<ExecuteResult>('POST', '/execute', {
      prompt: input.prompt,
      schema_id: input.schemaId,
      provider: input.provider,
      model: input.model,
      options: input.options,
    })
  }

  // ─── Schemas ──────────────────────────────────────────────────────────────

  async createSchema(input: SchemaInput): Promise<SchemaResult> {
    return this.request<SchemaResult>('POST', '/schemas', input)
  }

  async getSchema(id: string): Promise<SchemaResult> {
    return this.request<SchemaResult>('GET', `/schemas/${id}`)
  }

  async listSchemas(): Promise<{ schemas: SchemaResult[] }> {
    return this.request<{ schemas: SchemaResult[] }>('GET', '/schemas')
  }

  async updateSchema(id: string, input: Partial<SchemaInput>): Promise<SchemaResult> {
    return this.request<SchemaResult>('PUT', `/schemas/${id}`, input)
  }

  async deleteSchema(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('DELETE', `/schemas/${id}`)
  }

  // ─── Executions ───────────────────────────────────────────────────────────

  async listExecutions(params?: {
    page?: number
    limit?: number
    status?: string
    schema_id?: string
  }): Promise<PaginatedExecutions> {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.status) query.set('status', params.status)
    if (params?.schema_id) query.set('schema_id', params.schema_id)
    const qs = query.toString()
    return this.request<PaginatedExecutions>('GET', `/executions${qs ? '?' + qs : ''}`)
  }

  async getExecution(id: string): Promise<any> {
    return this.request<any>('GET', `/executions/${id}`)
  }

  // ─── Metrics ──────────────────────────────────────────────────────────────

  async getMetricsSummary(days?: number): Promise<MetricsSummary> {
    const qs = days ? `?days=${days}` : ''
    return this.request<MetricsSummary>('GET', `/metrics/summary${qs}`)
  }

  async getSchemaMetrics(schemaId: string): Promise<any> {
    return this.request<any>('GET', `/metrics/schemas/${schemaId}`)
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Reliant-Key': this.apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      const data = await response.json() as any

      if (!response.ok) {
        throw new ReliantError(
          data.message ?? data.error ?? `Request failed with status ${response.status}`,
          response.status,
          data,
        )
      }

      return data as T
    } catch (err) {
      if (err instanceof ReliantError) throw err
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ReliantError('Request timed out', 408)
      }
      throw new ReliantError(
        err instanceof Error ? err.message : 'Unknown error',
        0,
      )
    } finally {
      clearTimeout(timer)
    }
  }
}

export class ReliantError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ReliantError'
    this.status = status
    this.data = data
  }
}

export default Reliant
