import { getSecurityMonitoringSnapshot } from './api/queries/security-monitoring'
import { SecurityDashboard } from './components/security-dashboard'

export async function SecurityMonitoring() {
  const snapshot = await getSecurityMonitoringSnapshot()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Security Monitoring</h1>
          <p className="leading-7 text-muted-foreground">
            Monitor access attempts, detect anomalies, and manage security configurations
          </p>
        </div>

        <SecurityDashboard snapshot={snapshot} />
      </div>
    </div>
  )
}
