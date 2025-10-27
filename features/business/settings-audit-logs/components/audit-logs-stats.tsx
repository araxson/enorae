import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-secondary/10">
              <Activity className="h-6 w-6 text-secondary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Total Events (24h)</CardTitle>
            <CardDescription>Audit log volume in the last day</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="scroll-m-20 text-xl font-semibold">{stats.totalEvents}</h4>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Percentage of successful actions</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="scroll-m-20 text-xl font-semibold">{stats.successRate.toFixed(1)}%</h4>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Failed Actions</CardTitle>
            <CardDescription>Errors encountered in the last day</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="scroll-m-20 text-xl font-semibold">{stats.failedActions}</h4>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-accent/10">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Critical Events</CardTitle>
            <CardDescription>High severity occurrences</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="scroll-m-20 text-xl font-semibold">{stats.criticalEvents}</h4>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-accent/10">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Warnings</CardTitle>
            <CardDescription>Medium severity alerts</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="scroll-m-20 text-xl font-semibold">{stats.warningEvents}</h4>
        </CardContent>
      </Card>
    </div>
  )
}
