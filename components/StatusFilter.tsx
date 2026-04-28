'use client'

import { useMemo, useRef, useState } from 'react'
import { LayoutGrid, List, Search, X } from 'lucide-react'
import type { Market, MarketStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MarketCard } from './MarketCard'
import { MarketTable } from './MarketTable'

type FilterKey = 'all' | MarketStatus
type ViewMode = 'card' | 'list'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'ended', label: 'Ended' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'finalised', label: 'Finalised' },
]

export function StatusFilter({ markets }: { markets: Market[] }) {
  const [active, setActive] = useState<FilterKey>('all')
  const [view, setView] = useState<ViewMode>('card')
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set()
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const allCategories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const m of markets) {
      for (const c of m.categories) {
        counts.set(c, (counts.get(c) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [markets])

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const searchedMarkets = useMemo(() => {
    const q = query.trim().toLowerCase()
    return markets.filter((m) => {
      if (selectedCategories.size > 0) {
        const hasCat = m.categories.some((c) => selectedCategories.has(c))
        if (!hasCat) return false
      }
      if (!q) return true
      if (m.question.toLowerCase().includes(q)) return true
      if (m.categories.some((c) => c.toLowerCase().includes(q))) return true
      if (m.outcomes.some((o) => o.name.toLowerCase().includes(q))) return true
      return false
    })
  }, [markets, query, selectedCategories])

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: searchedMarkets.length,
      live: 0,
      ended: 0,
      resolved: 0,
      finalised: 0,
    }
    for (const m of searchedMarkets) c[m.status]++
    return c
  }, [searchedMarkets])

  const filtered = useMemo(() => {
    const list =
      active === 'all'
        ? searchedMarkets
        : searchedMarkets.filter((m) => m.status === active)
    return [...list].sort((a, b) => {
      const liveOrder = (s: MarketStatus) => (s === 'live' ? 0 : 1)
      if (liveOrder(a.status) !== liveOrder(b.status)) {
        return liveOrder(a.status) - liveOrder(b.status)
      }
      return b.volume - a.volume
    })
  }, [searchedMarkets, active])

  return (
    <div>
      <div className="mb-4">
        <div
          className={cn(
            'flex h-10 items-center gap-2 rounded-lg border px-3 transition-colors',
            query
              ? 'border-text-brand/60 bg-surface-input'
              : 'border-border-dark bg-surface-input hover:border-text-secondary/60 focus-within:border-text-brand/60'
          )}
        >
          <Search className="text-text-secondary h-4 w-4 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, outcomes, categories..."
            className="placeholder:text-text-muted text-text-primary min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              aria-label="Clear search"
              className="text-text-muted hover:text-text-primary shrink-0 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {allCategories.length > 0 && (
        <div className="scrollbar-none mb-3 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-text-muted shrink-0 pr-1 text-[11px] font-medium tracking-wider uppercase">
            Category
          </span>
          <button
            onClick={() => setSelectedCategories(new Set())}
            className={cn(
              'shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
              selectedCategories.size === 0
                ? 'border-text-brand/60 bg-text-brand/15 text-text-brand'
                : 'border-border-dark text-text-secondary bg-surface-chip hover:border-text-secondary/60 hover:text-text-primary'
            )}
          >
            All
          </button>
          {allCategories.map(([cat, count]) => {
            const isOn = selectedCategories.has(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  isOn
                    ? 'border-text-brand/60 bg-text-brand/15 text-text-brand'
                    : 'border-border-dark text-text-secondary bg-surface-chip hover:border-text-secondary/60 hover:text-text-primary'
                )}
              >
                {cat}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[9px] tabular-nums',
                    isOn
                      ? 'bg-text-brand/20'
                      : 'bg-border-dark text-text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => {
            const isActive = active === f.key
            if (counts[f.key] === 0 && f.key !== 'all') return null
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-text-brand/60 bg-text-brand/15 text-text-brand'
                    : 'border-border-dark text-text-secondary bg-surface-chip hover:border-text-secondary/60 hover:text-text-primary'
                )}
              >
                {f.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] tabular-nums',
                    isActive
                      ? 'bg-text-brand/20'
                      : 'bg-border-dark text-text-muted'
                  )}
                >
                  {counts[f.key]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="border-border-dark bg-surface-chip flex items-center gap-0.5 rounded-full border p-0.5">
          <ViewToggleButton
            active={view === 'card'}
            onClick={() => setView('card')}
            label="Card view"
            icon={<LayoutGrid className="h-3.5 w-3.5" />}
          />
          <ViewToggleButton
            active={view === 'list'}
            onClick={() => setView('list')}
            label="List view"
            icon={<List className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-border-dark text-text-muted rounded-xl border border-dashed py-16 text-center text-sm">
          {query
            ? `No markets match "${query}".`
            : 'No markets in this state.'}
        </div>
      ) : view === 'card' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m, i) => (
            <MarketCard key={m.address} market={m} index={i} />
          ))}
        </div>
      ) : (
        <MarketTable markets={filtered} />
      )}
    </div>
  )
}

function ViewToggleButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
        active
          ? 'bg-text-brand/20 text-text-brand'
          : 'text-text-muted hover:text-text-primary'
      )}
    >
      {icon}
    </button>
  )
}
