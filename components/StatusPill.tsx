import { cn } from '@/lib/utils'
import type { MarketStatus } from '@/lib/types'

const styles: Record<MarketStatus, string> = {
  live: 'text-live-dot border-live-dot/30 bg-live-dot/10',
  ended: 'text-warning border-warning/30 bg-warning/10',
  resolved: 'text-info border-info/30 bg-info/10',
  finalised: 'text-text-secondary border-border-dark bg-surface-chip',
}

const labels: Record<MarketStatus, string> = {
  live: 'Live',
  ended: 'Ended',
  resolved: 'Resolved',
  finalised: 'Finalised',
}

export function StatusPill({ status }: { status: MarketStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase',
        styles[status]
      )}
    >
      {status === 'live' && (
        <span className="bg-live-dot animate-live-dot shadow-live-dot-glow inline-block h-1.5 w-1.5 rounded-full" />
      )}
      {labels[status]}
    </span>
  )
}
