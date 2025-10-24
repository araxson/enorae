import { getRateLimitTracking } from './api/queries'
import { RateLimitClient } from './components/rate-limit-client'

export async function RateLimitConsole() {
  const snapshot = await getRateLimitTracking({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Rate Limiting Console</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor and manage rate limits across identifiers and endpoints
          </p>
        </div>
        <RateLimitClient snapshot={snapshot} />
      </div>
    </section>
  )
}
