import { getAuditLogs, getAuditLogStats } from '@/features/business/settings-audit-logs/api/queries'
import { getUserSalonId } from '@/lib/auth'
import { AuditLogsStats } from './audit-logs-stats'
import { AuditLogsClient } from './audit-logs-client'
import { ItemDescription, ItemTitle } from '@/components/ui/item'

export async function AuditLogsContent() {
  const salonId = await getUserSalonId()
  if (!salonId) throw new Error('No salon ID found')

  const [logs, stats] = await Promise.all([
    getAuditLogs(salonId),
    getAuditLogStats(salonId)
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ItemTitle>Security Audit Logs</ItemTitle>
        <ItemDescription>
          Track all system activities and security events
        </ItemDescription>
      </div>

      <AuditLogsStats stats={stats} />
      <AuditLogsClient initialLogs={logs} />
    </div>
  )
}
