import { Section, Stack, Box, Flex } from '@/components/layout'
import { H1, H2, P, Lead } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Activity, AlertTriangle, UserX } from 'lucide-react'
import { getSecurityOverview, getAuditLogs, getSecurityEvents } from './api/queries'
import { AuditLogsTable } from './components/audit-logs-table'
import { SecurityEventsTable } from './components/security-events-table'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function SecurityAudit() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const dateTo = new Date().toISOString()

  const [overview, auditLogs, securityEvents] = await Promise.all([
    getSecurityOverview(dateFrom, dateTo),
    getAuditLogs({ limit: 50 }),
    getSecurityEvents({ limit: 50 }),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Security & Audit Logs</H1>
          <Lead>Monitor platform activity and security events</Lead>
        </Box>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Total Audit Logs</P>
                  <p className="text-2xl font-bold">{overview.totalAuditLogs}</p>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Security Events</P>
                  <p className="text-2xl font-bold">{overview.totalSecurityEvents}</p>
                </div>
                <Shield className="h-4 w-4 text-blue-500" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Failed Logins</P>
                  <p className="text-2xl font-bold">{overview.failedLogins}</p>
                </div>
                <UserX className="h-4 w-4 text-orange-500" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Suspicious Activity</P>
                  <p className="text-2xl font-bold">{overview.suspiciousActivity}</p>
                </div>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </Flex>
            </CardContent>
          </Card>
        </div>

        {/* Security Events */}
        <Box>
          <H2>Recent Security Events</H2>
          <P className="text-muted-foreground mb-4">
            Failed login attempts and suspicious activity
          </P>
          <SecurityEventsTable events={securityEvents} />
        </Box>

        {/* Audit Logs */}
        <Box>
          <H2>Recent Audit Logs</H2>
          <P className="text-muted-foreground mb-4">
            All user actions and system events
          </P>
          <AuditLogsTable logs={auditLogs} />
        </Box>
      </Stack>
    </Section>
  )
}
