import { getSecurityMonitoringSnapshot } from './api/queries/security-monitoring'
import { SecurityDashboard } from './components/security-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function SecurityMonitoring() {
  const snapshot = await getSecurityMonitoringSnapshot()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <Stack gap="xl">
        <div>
          <H1>Security Monitoring</H1>
          <P className="text-muted-foreground">
            Monitor access attempts, detect anomalies, and manage security configurations
          </P>
        </div>

        <SecurityDashboard snapshot={snapshot} />
      </Stack>
    </div>
  )
}
