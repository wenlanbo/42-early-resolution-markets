'use client'

import { useEffect } from 'react'
import { ExternalLink, X } from 'lucide-react'
import type { Market } from '@/lib/types'
import { Markdown } from './Markdown'
import { StatusPill } from './StatusPill'

export function ResolutionModal({
  market,
  onClose,
}: {
  market: Market | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!market) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [market, onClose])

  if (!market) return null

  return (
    <div
      className="animate-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Resolution rules"
    >
      <div
        className="border-border-dark bg-card-dark animate-modal-content flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border-dark/60 flex items-start gap-3 border-b px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <StatusPill status={market.status} />
              {market.categories.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="text-text-secondary bg-surface-chip rounded-full px-2 py-0.5 text-[10px] font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
            <h2 className="text-text-primary pr-2 text-base leading-snug font-semibold sm:text-lg">
              {market.question}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-text-muted hover:bg-surface-chip hover:text-text-primary -mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-5">
          {market.description ? (
            <Markdown source={market.description} />
          ) : (
            <p className="text-text-muted text-sm">
              No resolution rules available for this market.
            </p>
          )}
        </div>

        <div className="border-border-dark/60 bg-card-dark flex items-center justify-between gap-3 border-t px-5 py-3">
          <span className="text-text-muted truncate font-mono text-[10px]">
            {market.address}
          </span>
          <a
            href={`https://42.space/event/${market.address}`}
            target="_blank"
            rel="noreferrer"
            className="text-text-brand hover:bg-text-brand/10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
          >
            View on 42
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
