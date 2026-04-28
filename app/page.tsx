import { fetchEarlyResolutionMarkets } from '@/lib/api'
import { Header } from '@/components/Header'
import { StatusFilter } from '@/components/StatusFilter'

export const revalidate = 60

export default async function HomePage() {
  const markets = await fetchEarlyResolutionMarkets()

  return (
    <main className="min-h-screen">
      <Header total={markets.length} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusFilter markets={markets} />
      </section>

      <footer className="border-border-dark/60 mt-16 border-t">
        <div className="text-text-muted mx-auto max-w-7xl px-4 py-6 text-xs sm:px-6 lg:px-8">
          Data from{' '}
          <a
            href="https://docs.42.space"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-brand"
          >
            rest.ft.42.space
          </a>{' '}
          · Cached 60s
        </div>
      </footer>
    </main>
  )
}
