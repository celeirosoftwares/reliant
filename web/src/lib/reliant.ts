import { Reliant } from 'reliant-js'

export function createReliantClient(apiKey: string) {
  return new Reliant({
    apiKey,
    baseUrl: process.env.NEXT_PUBLIC_RELIANT_API_URL || 'https://reliant-production.up.railway.app',
  })
}
