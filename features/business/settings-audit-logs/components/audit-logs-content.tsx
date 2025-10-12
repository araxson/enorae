import { getUserSalonId } from '@/lib/auth'
import { getAuditLogs, getAuditLogStats } from '../api/queries'
import { AuditLogsStats } from './audit-logs-stats'
import { AuditLogsClient } from './audit-logs-client'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function AuditLogsContent() {
  const salonId = await getUserSalonId()
  if (!salonId) throw new Error('No salon ID found')

  const [logs, stats] = await Promise.all([
    getAuditLogs(salonId),
    getAuditLogStats(salonId)
  ])

  return (
    <Stack gap="xl">
      <div>
        <H1>Security Audit Logs</H1>
        <P className="text-muted-foreground">
          Track all system activities and security events
        </P>
      </div>

      <AuditLogsStats stats={stats} />
      <AuditLogsClient initialLogs={logs} />
    </Stack>
  )
}
