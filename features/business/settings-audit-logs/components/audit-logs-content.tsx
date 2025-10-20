import { getUserSalonId } from '@/lib/auth'
import { getAuditLogs, getAuditLogStats } from '../api/queries'
import { AuditLogsStats } from './audit-logs-stats'
import { AuditLogsClient } from './audit-logs-client'
import { Stack } from '@/components/layout'

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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Security Audit Logs</h1>
        <p className="leading-7 text-muted-foreground">
          Track all system activities and security events
        </p>
      </div>

      <AuditLogsStats stats={stats} />
      <AuditLogsClient initialLogs={logs} />
    </Stack>
  )
}
