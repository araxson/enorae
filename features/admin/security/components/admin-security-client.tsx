import { Card, CardContent } from '@/components/ui/card'
import { Shield, Activity, AlertTriangle, UserX } from 'lucide-react'
import { getSecurityOverview, getAuditLogs, getSecurityEvents } from '../api/queries'
import { AuditLogsTable } from './audit-logs-table'
import { SecurityEventsTable } from './security-events-table'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function AdminSecurityClient() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const dateTo = new Date().toISOString()

  const [overview, auditLogs, securityEvents] = await Promise.all([
    getSecurityOverview(dateFrom, dateTo),
    getAuditLogs({ limit: 50 }),
    getSecurityEvents({ limit: 50 }),
  ])

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Total Audit Logs</p>
                  <p className="leading-7 text-2xl font-semibold text-foreground">
                    {overview.totalAuditLogs}
                  </p>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Security Events</p>
                  <p className="leading-7 text-2xl font-semibold text-foreground">
                    {overview.totalSecurityEvents}
                  </p>
                </div>
                <Shield className="h-4 w-4 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Failed Logins</p>
                  <p className="leading-7 text-2xl font-semibold text-foreground">
                    {overview.failedLogins}
                  </p>
                </div>
                <UserX className="h-4 w-4 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Suspicious Activity</p>
                  <p className="leading-7 text-2xl font-semibold text-foreground">
                    {overview.suspiciousActivity}
                  </p>
                </div>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="leading-7 text-sm font-semibold uppercase tracking-wide">Recent Security Events</p>
          <p className="text-sm text-muted-foreground mb-4">
            Failed login attempts and suspicious activity
          </p>
          <SecurityEventsTable events={securityEvents} />
        </div>

        <div>
          <p className="leading-7 text-sm font-semibold uppercase tracking-wide">Recent Audit Logs</p>
          <p className="text-sm text-muted-foreground mb-4">All user actions and system events</p>
          <AuditLogsTable logs={auditLogs} />
        </div>
        </div>
      </div>
    </section>
  )
}
