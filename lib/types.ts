export type MarketStatus = 'live' | 'ended' | 'resolved' | 'finalised'

export interface Outcome {
  tokenId: string
  name: string
  index: number
  price: number
  volume: number
  marketCap: number
  payout: number
  mintedQuantity: number
  symbol: string
  image: string | null
}

export interface Market {
  address: string
  questionId: string
  question: string
  slug: string
  collateralSymbol: string
  collateralDecimals: number
  startDate: string
  endDate: string
  status: MarketStatus
  elapsedPct: number
  image: string | null
  description: string | null
  resolvedAnswer: string | null
  totalMarketCap: number
  volume: number
  traders: number
  categories: string[]
  tags: string[]
  outcomes: Outcome[]
}

export interface MarketsResponse {
  data: Market[]
  pagination: {
    hasMore: boolean
    totalResults: number
  }
}
