'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  ExternalLink,
  Loader2,
  Maximize2,
} from 'lucide-react'
import type { Market } from '@/lib/types'
import {
  cn,
  formatDate,
  formatUsd,
  parseResolutionSource,
} from '@/lib/utils'
import { StatusPill } from './StatusPill'
import { ResolutionModal } from './ResolutionModal'

type SortKey =
  | 'question'
  | 'startDate'
  | 'endDate'
  | 'volume'
  | 'traders'
  | 'totalMarketCap'
type SortDir = 'asc' | 'desc'

const DEFAULT_DIR: Record<SortKey, SortDir> = {
  question: 'asc',
  startDate: 'asc',
  endDate: 'asc',
  volume: 'desc',
  traders: 'desc',
  totalMarketCap: 'desc',
}

function compareMarkets(a: Market, b: Market, key: SortKey): number {
  if (key === 'question') return a.question.localeCompare(b.question)
  if (key === 'startDate' || key === 'endDate') {
    return new Date(a[key]).getTime() - new Date(b[key]).getTime()
  }
  return (a[key] as number) - (b[key] as number)
}

function SortHeader({
  label,
  sortKey,
  current,
  onSort,
  align = 'left',
}: {
  label: string
  sortKey: SortKey
  current: { key: SortKey; dir: SortDir } | null
  onSort: (key: SortKey) => void
  align?: 'left' | 'right'
}) {
  const isActive = current?.key === sortKey
  const dir = isActive ? current.dir : null
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        'group inline-flex items-center gap-1 transition-colors',
        align === 'right' && 'flex-row-reverse',
        isActive
          ? 'text-text-brand'
          : 'text-text-muted hover:text-text-primary'
      )}
    >
      {label}
      <span className="inline-flex h-3 w-3 items-center justify-center">
        {dir === 'asc' ? (
          <ChevronUp className="h-3 w-3" />
        ) : dir === 'desc' ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronsUpDown className="text-text-muted/50 h-3 w-3" />
        )}
      </span>
    </button>
  )
}

function renderInlineMd(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(
      <a
        key={`${match.index}-${match[2]}`}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="text-text-brand hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {match[1]}
      </a>
    )
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

async function downloadMarketJson(market: Market) {
  const base = 'https://rest.ft.42.space'
  const [marketRes, timelineRes] = await Promise.allSettled([
    fetch(`${base}/api/v1/markets/${market.address}`).then((r) =>
      r.ok ? r.json() : Promise.reject(new Error(`market ${r.status}`))
    ),
    fetch(`${base}/api/v1/markets/${market.address}/timeline`).then((r) =>
      r.ok ? r.json() : Promise.reject(new Error(`timeline ${r.status}`))
    ),
  ])

  const bundle = {
    exportedAt: new Date().toISOString(),
    source: base,
    market:
      marketRes.status === 'fulfilled' ? marketRes.value : market,
    timeline:
      timelineRes.status === 'fulfilled' ? timelineRes.value : null,
  }

  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `42-market-${market.slug || market.address}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function MarketTable({ markets }: { markets: Market[] }) {
  const [selected, setSelected] = useState<Market | null>(null)
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  function handleSort(key: SortKey) {
    setSort((prev) => {
      if (prev?.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key, dir: DEFAULT_DIR[key] }
    })
  }

  async function handleDownload(m: Market) {
    if (downloading) return
    setDownloading(m.address)
    try {
      await downloadMarketJson(m)
    } finally {
      setDownloading(null)
    }
  }

  const sortedMarkets = useMemo(() => {
    if (!sort) return markets
    const list = [...markets]
    list.sort((a, b) => {
      const cmp = compareMarkets(a, b, sort.key)
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [markets, sort])

  return (
    <>
      <div className="border-border-dark/60 overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-chip/40 border-border-dark/60 border-b text-left text-[11px] font-medium tracking-wider uppercase">
                <th className="px-4 py-3">
                  <SortHeader
                    label="Market"
                    sortKey="question"
                    current={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-3 whitespace-nowrap">
                  <SortHeader
                    label="Start"
                    sortKey="startDate"
                    current={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-3 whitespace-nowrap">
                  <SortHeader
                    label="End"
                    sortKey="endDate"
                    current={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-3 text-right whitespace-nowrap">
                  <SortHeader
                    label="Volume"
                    sortKey="volume"
                    current={sort}
                    onSort={handleSort}
                    align="right"
                  />
                </th>
                <th className="px-3 py-3 text-right whitespace-nowrap">
                  <SortHeader
                    label="Holders"
                    sortKey="traders"
                    current={sort}
                    onSort={handleSort}
                    align="right"
                  />
                </th>
                <th className="px-3 py-3 text-right whitespace-nowrap">
                  <SortHeader
                    label="Total MCap"
                    sortKey="totalMarketCap"
                    current={sort}
                    onSort={handleSort}
                    align="right"
                  />
                </th>
                <th className="text-text-muted px-4 py-3 font-medium">
                  Resolution Source
                </th>
                <th className="text-text-muted w-10 px-2 py-3 font-medium">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((m) => {
                const source = parseResolutionSource(m.description)
                return (
                  <tr
                    key={m.address}
                    className="border-border-dark/40 hover:bg-surface-chip/25 group border-b transition-colors last:border-b-0"
                  >
                    <td className="px-4 py-3 align-top">
                      <a
                        href={`https://42.space/event/${m.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-2.5"
                      >
                        {m.image ? (
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={m.image}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="bg-surface-chip h-9 w-9 shrink-0 rounded-md" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-text-primary group-hover:text-text-brand line-clamp-2 text-sm leading-snug font-medium transition-colors">
                            {m.question}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <StatusPill status={m.status} />
                            <ExternalLink className="text-text-muted h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </div>
                      </a>
                    </td>
                    <td className="text-text-secondary px-3 py-3 align-top text-xs whitespace-nowrap tabular-nums">
                      {formatDate(m.startDate)}
                    </td>
                    <td className="text-text-secondary px-3 py-3 align-top text-xs whitespace-nowrap tabular-nums">
                      {formatDate(m.endDate)}
                    </td>
                    <td className="text-text-primary px-3 py-3 text-right align-top font-mono text-xs whitespace-nowrap tabular-nums">
                      {formatUsd(m.volume, { compact: true })}
                    </td>
                    <td className="text-text-primary px-3 py-3 text-right align-top font-mono text-xs tabular-nums">
                      {m.traders}
                    </td>
                    <td className="text-text-primary px-3 py-3 text-right align-top font-mono text-xs whitespace-nowrap tabular-nums">
                      {formatUsd(m.totalMarketCap, { compact: true })}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => setSelected(m)}
                        title="Click to view full resolution rules"
                        className={cn(
                          'group/src hover:bg-surface-chip/60 -mx-2 -my-1.5 flex max-w-[440px] items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
                          'focus-visible:ring-text-brand/50 focus:outline-none focus-visible:ring-2'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          {source ? (
                            <div className="text-text-secondary line-clamp-3 text-xs leading-relaxed whitespace-pre-line">
                              {renderInlineMd(source)}
                            </div>
                          ) : (
                            <span className="text-text-muted text-xs">
                              View rules
                            </span>
                          )}
                        </div>
                        <Maximize2 className="text-text-muted group-hover/src:text-text-brand mt-0.5 h-3 w-3 shrink-0 opacity-60 transition-colors group-hover/src:opacity-100" />
                      </button>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => handleDownload(m)}
                        disabled={downloading === m.address}
                        title="Download full market data as JSON"
                        aria-label="Download market JSON"
                        className={cn(
                          'hover:bg-surface-chip/70 hover:text-text-brand text-text-muted flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                          'focus-visible:ring-text-brand/50 focus:outline-none focus-visible:ring-2',
                          downloading === m.address &&
                            'text-text-brand pointer-events-none'
                        )}
                      >
                        {downloading === m.address ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ResolutionModal market={selected} onClose={() => setSelected(null)} />
    </>
  )
}
