// src/lib/api.ts — API client for the dashboard
const API_BASE = process.env.NEXT_PUBLIC_RELIANT_API_URL ?? 'http://localhost:3100'

let _apiKey: string | null = null

export function setApiKey(key: string) {
  _apiKey = key
  if (typeof window !== 'undefined') {
    localStorage.setItem('reliant_api_key', key)
  }
}

export function getApiKey(): string | null {
  if (_apiKey) return _apiKey
  if (typeof window !== 'undefined') {
    _apiKey = localStorage.getItem('reliant_api_key')
  }
  return _apiKey
}

export function clearApiKey() {
  _apiKey = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('reliant_api_key')
  }
}

export async function api<T = any>(path: string, options?: RequestInit): Promise<T> {
  const key = getApiKey()
  if (!key) throw new Error('No API key set')

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Reliant-Key': key,
      ...options?.headers,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? `Request failed: ${res.status}`)
  }

  return data as T
}
