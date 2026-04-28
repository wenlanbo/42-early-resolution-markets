import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUsd(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && Math.abs(n) >= 1000) {
    return n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(2)}M`
      : `$${(n / 1000).toFixed(1)}K`
  }
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}

export function formatPct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`
}

export function formatRelativeDate(iso: string): string {
  const target = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = target - now
  const future = diffMs > 0
  const abs = Math.abs(diffMs)

  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  let value: number
  let unit: string
  if (abs < hour) {
    value = Math.round(abs / minute)
    unit = 'min'
  } else if (abs < day) {
    value = Math.round(abs / hour)
    unit = 'hr'
  } else if (abs < 30 * day) {
    value = Math.round(abs / day)
    unit = 'day'
  } else {
    value = Math.round(abs / (30 * day))
    unit = 'mo'
  }

  const plural = value === 1 ? '' : 's'
  return future ? `in ${value} ${unit}${plural}` : `${value} ${unit}${plural} ago`
}

export function topOutcomes<T extends { price: number }>(
  outcomes: T[],
  n = 3
): T[] {
  return [...outcomes].sort((a, b) => b.price - a.price).slice(0, n)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function parseResolutionSource(
  description: string | null | undefined
): string | null {
  if (!description) return null

  const heading = description.match(
    /(?:^|\n)#{2,3}\s*Resolution\s*(?:Sources?|Souce[\/\s]*Criteria)\s*:?\s*\n?([\s\S]*?)(?=\n#{2,3}\s|\Z)/i
  )
  if (heading && heading[1].trim()) return heading[1].trim()

  const inlineBold = description.match(
    /(?:^|\n)\s*[-*]?\s*\*\*\s*(?:Primary\s+|Secondary\s+)?Resolution\s*Sources?\s*\*\*\s*:?\s*([^\n]+)/i
  )
  if (inlineBold) return inlineBold[1].trim().replace(/^[-*:]\s*/, '')

  const plain = description.match(
    /(?:^|\n)\s*[-*\d.)\s]*\s*(?:Oracle\s+source|Resolution\s+sources?|Sources?(?:\s+of\s+truth)?)\s*[:：]\s*([^\n]+)/i
  )
  if (plain) return plain[1].trim()

  const target = description.match(
    /(?:^|\n)\s*[-*\d.)\s]*\s*Target\s+page\s*[:：]\s*([^\n]+)/i
  )
  if (target) return target[1].trim()

  return null
}
