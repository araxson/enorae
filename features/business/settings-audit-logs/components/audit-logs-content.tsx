import { getUserSalonId } from '@/lib/auth'
import { getAuditLogs, getAuditLogStats } from '@/features/business/settings-audit-logs/api/queries'
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
      <div>
        <h1 className="text-4xl font-bold">Security Audit Logs</h1>
        <p className="leading-7 text-muted-foreground">
          Track all system activities and security events
        </p>
      </div>

      <AuditLogsStats stats={stats} />
      <AuditLogsClient initialLogs={logs} />
    </div>
  )
}
