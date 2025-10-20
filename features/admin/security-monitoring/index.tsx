import { getSecurityMonitoringSnapshot } from './api/queries/security-monitoring'
import { SecurityDashboard } from './components/security-dashboard'
import { Stack } from '@/components/layout'

export async function SecurityMonitoring() {
  const snapshot = await getSecurityMonitoringSnapshot()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <Stack gap="xl">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Security Monitoring</h1>
          <p className="leading-7 text-muted-foreground">
            Monitor access attempts, detect anomalies, and manage security configurations
          </p>
        </div>

        <SecurityDashboard snapshot={snapshot} />
      </Stack>
    </div>
  )
}
