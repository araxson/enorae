import { getSecurityMonitoringSnapshot } from './api/security-monitoring.queries'
import { SecurityDashboard } from './components/security-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function SecurityMonitoring() {
  const snapshot = await getSecurityMonitoringSnapshot()

  return (
    <Stack gap="xl">
      <div>
        <H1>Security Monitoring</H1>
        <P className="text-muted-foreground">
          Monitor access attempts, detect anomalies, and manage security configurations
        </P>
      </div>

      <SecurityDashboard snapshot={snapshot} />
    </Stack>
  )
}
