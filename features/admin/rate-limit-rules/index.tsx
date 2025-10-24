import { getRateLimitRules } from './api/queries'
import { RateLimitRulesClient } from './components/rate-limit-rules-client'

export async function PolicyEnforcementOverview() {
  const snapshot = await getRateLimitRules({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Policy Enforcement Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Define and manage rate limiting policies across all API endpoints
          </p>
        </div>
        <RateLimitRulesClient snapshot={snapshot} />
      </div>
    </section>
  )
}
