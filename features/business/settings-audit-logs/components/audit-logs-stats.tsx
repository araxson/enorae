import { Card } from '@/components/ui/card'
import { Grid, Flex, Stack } from '@/components/layout'
import { H4, Muted } from '@/components/ui/typography'
import { Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

interface AuditLogsStatsProps {
  stats: {
    totalEvents: number
    failedActions: number
    criticalEvents: number
    warningEvents: number
    successRate: number
  }
}

export function AuditLogsStats({ stats }: AuditLogsStatsProps) {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 5 }} gap="lg">
      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <Stack gap="xs">
            <Muted className="text-sm">Total Events (24h)</Muted>
            <H4>{stats.totalEvents}</H4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <Stack gap="xs">
            <Muted className="text-sm">Success Rate</Muted>
            <H4>{stats.successRate.toFixed(1)}%</H4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <Stack gap="xs">
            <Muted className="text-sm">Failed Actions</Muted>
            <H4>{stats.failedActions}</H4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <Stack gap="xs">
            <Muted className="text-sm">Critical Events</Muted>
            <H4>{stats.criticalEvents}</H4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <Stack gap="xs">
            <Muted className="text-sm">Warnings</Muted>
            <H4>{stats.warningEvents}</H4>
          </Stack>
        </Flex>
      </Card>
    </Grid>
  )
}
