import Image from 'next/image'
import { Users, BarChart3, Clock } from 'lucide-react'
import type { Market } from '@/lib/types'
import { cn, formatUsd, formatPct, formatRelativeDate, topOutcomes } from '@/lib/utils'
import { StatusPill } from './StatusPill'

export function MarketCard({
  market,
  index = 0,
}: {
  market: Market
  index?: number
}) {
  const top = topOutcomes(market.outcomes, 3)
  const winner = market.outcomes.find((o) =>
    market.resolvedAnswer
      ? o.name.toLowerCase() === market.resolvedAnswer.toLowerCase()
      : false
  )

  return (
    <a
      href={`https://42.space/event/${market.address}`}
      target="_blank"
      rel="noreferrer"
      style={{ ['--stagger-index' as string]: index }}
      className={cn(
        'group bg-card-dark border-border-dark animate-market-card-in flex flex-col overflow-hidden rounded-xl border',
        'hover:border-text-brand/50 hover:shadow-text-brand/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
      )}
    >
      <div className="relative flex items-start gap-3 p-4">
        {market.image ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={market.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-surface-chip h-14 w-14 shrink-0 rounded-lg" />
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5">
            <StatusPill status={market.status} />
            {market.categories.slice(0, 1).map((c) => (
              <span
                key={c}
                className="text-text-secondary bg-surface-chip rounded-full px-2 py-0.5 text-[10px] font-medium"
              >
                {c}
              </span>
            ))}
          </div>
          <h3 className="text-text-primary line-clamp-2 text-sm leading-snug font-semibold">
            {market.question}
          </h3>
        </div>
      </div>

      <div className="border-border-dark/60 space-y-1.5 border-t px-4 py-3">
        {top.map((o) => {
          const isWinner =
            winner && o.name.toLowerCase() === winner.name.toLowerCase()
          return (
            <div
              key={o.tokenId}
              className="flex items-center justify-between gap-2"
            >
              <span
                className={cn(
                  'truncate text-xs',
                  isWinner
                    ? 'text-green3 font-semibold'
                    : 'text-text-secondary'
                )}
              >
                {o.symbol || o.name.replace(/_/g, ' ')}
              </span>
              <span
                className={cn(
                  'shrink-0 font-mono text-xs tabular-nums',
                  isWinner ? 'text-green3' : 'text-text-primary'
                )}
              >
                {formatPct(o.price, 1)}
              </span>
            </div>
          )
        })}
        {market.outcomes.length > top.length && (
          <div className="text-text-muted pt-0.5 text-[10px]">
            +{market.outcomes.length - top.length} more outcome
            {market.outcomes.length - top.length === 1 ? '' : 's'}
          </div>
        )}
      </div>

      <div className="border-border-dark/60 text-text-muted mt-auto flex items-center justify-between gap-2 border-t px-4 py-2.5 text-[11px]">
        <span className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          {formatUsd(market.volume, { compact: true })}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {market.traders}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatRelativeDate(market.endDate)}
        </span>
      </div>
    </a>
  )
}
