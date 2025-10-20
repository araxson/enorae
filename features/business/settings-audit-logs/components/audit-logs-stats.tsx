import { Card } from '@/components/ui/card'
import { Grid, Flex, Stack } from '@/components/layout'
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
            <p className="text-sm text-muted-foreground text-sm">Total Events (24h)</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.totalEvents}</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Success Rate</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.successRate.toFixed(1)}%</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Failed Actions</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.failedActions}</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Critical Events</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.criticalEvents}</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Warnings</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.warningEvents}</h4>
          </Stack>
        </Flex>
      </Card>
    </Grid>
  )
}
