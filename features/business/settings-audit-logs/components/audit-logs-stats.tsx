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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
            <Activity className="h-6 w-6 text-info" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Total Events (24h)</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.totalEvents}</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Success Rate</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.successRate.toFixed(1)}%</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Failed Actions</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.failedActions}</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <Stack gap="xs">
            <p className="text-sm text-muted-foreground text-sm">Critical Events</p>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{stats.criticalEvents}</h4>
          </Stack>
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex gap="md" align="center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
            <AlertTriangle className="h-6 w-6 text-warning" />
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
