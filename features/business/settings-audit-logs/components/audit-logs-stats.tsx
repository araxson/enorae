import { Card } from '@/components/ui/card'
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
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      <Card className="p-6">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
            <Activity className="h-6 w-6 text-secondary" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-sm">Total Events (24h)</p>
            <h4 className="scroll-m-20 text-xl font-semibold">{stats.totalEvents}</h4>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-sm">Success Rate</p>
            <h4 className="scroll-m-20 text-xl font-semibold">{stats.successRate.toFixed(1)}%</h4>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-sm">Failed Actions</p>
            <h4 className="scroll-m-20 text-xl font-semibold">{stats.failedActions}</h4>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <AlertTriangle className="h-6 w-6 text-accent" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-sm">Critical Events</p>
            <h4 className="scroll-m-20 text-xl font-semibold">{stats.criticalEvents}</h4>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <AlertTriangle className="h-6 w-6 text-accent" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-sm">Warnings</p>
            <h4 className="scroll-m-20 text-xl font-semibold">{stats.warningEvents}</h4>
          </div>
        </div>
      </Card>
    </div>
  )
}
