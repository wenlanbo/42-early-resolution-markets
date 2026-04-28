import type { MarketsResponse, Market } from './types'

const API_BASE = 'https://rest.ft.42.space'
const EARLY_RES_TAG = 'Early Resolution'

export async function fetchEarlyResolutionMarkets(): Promise<Market[]> {
  const url = new URL('/api/v1/markets', API_BASE)
  url.searchParams.set('tag', EARLY_RES_TAG)
  url.searchParams.set('status', 'all')
  url.searchParams.set('limit', '500')

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`42 API error: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as MarketsResponse
  return json.data
}
