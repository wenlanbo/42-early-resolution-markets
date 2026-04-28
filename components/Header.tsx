import { Zap } from 'lucide-react'

export function Header({ total }: { total: number }) {
  return (
    <header className="border-border-dark/60 border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="bg-text-brand/15 text-text-brand flex h-9 w-9 items-center justify-center rounded-lg">
            <Zap className="h-5 w-5" />
          </div>
          <div className="text-text-primary text-base leading-tight font-semibold">
            Early Resolution Markets on 42
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted hidden text-xs sm:inline">
            {total} market{total === 1 ? '' : 's'}
          </span>
          <a
            href="https://42.space"
            target="_blank"
            rel="noreferrer"
            className="text-text-secondary hover:text-text-brand text-xs transition-colors"
          >
            42.space ↗
          </a>
        </div>
      </div>
    </header>
  )
}
