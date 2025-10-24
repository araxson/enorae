import { getSessionSecurityMonitoring } from './api/queries'
import { SessionSecurityClient } from './components/session-security-client'

export async function SessionSecurityMonitoring() {
  const snapshot = await getSessionSecurityMonitoring({ limit: 100, offset: 0 })

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Session Security Management</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor session risk scores and enforce MFA requirements across the platform
          </p>
        </div>
        <SessionSecurityClient snapshot={snapshot} />
      </div>
    </section>
  )
}
