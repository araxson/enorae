import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuditLogs, getAuditLogStats } from '@/features/business/settings-audit-logs/api/queries'
import { getUserSalonId } from '@/lib/auth'
import { AuditLogsStats } from './audit-logs-stats'
import { AuditLogsClient } from './audit-logs-client'

export async function AuditLogsContent() {
  const salonId = await getUserSalonId()
  if (!salonId) throw new Error('No salon ID found')

  const [logs, stats] = await Promise.all([
    getAuditLogs(salonId),
    getAuditLogStats(salonId)
  ])

  return (
    <div className="flex flex-col gap-8">
      <CardHeader className="px-0">
        <CardTitle>Security Audit Logs</CardTitle>
        <CardDescription>
          Track all system activities and security events
        </CardDescription>
      </CardHeader>

      <AuditLogsStats stats={stats} />
      <AuditLogsClient initialLogs={logs} />
    </div>
  )
}
