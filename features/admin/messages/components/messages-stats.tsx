import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { MessageStats } from '@/features/admin/messages/api/queries'
import { MessageSquare, AlertTriangle, ShieldAlert, GitPullRequest, Clock, Timer, MailWarning } from 'lucide-react'

interface MessagesStatsProps {
  stats: MessageStats
}

const formatMinutes = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  if (value < 1) return '<1m'
  const hours = Math.floor(value / 60)
  const minutes = Math.round(value % 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatPercentage = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  return `${Math.round(value * 100)}%`
}

export function MessagesStats({ stats }: MessagesStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Total Threads</CardTitle>
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardDescription>
            Open {stats.openThreads} · In progress {stats.inProgressThreads}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.totalThreads}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Urgent Threads</CardTitle>
            <AlertTriangle className="h-8 w-8 text-accent" />
          </div>
          <CardDescription>High priority {stats.highPriorityThreads}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.urgentThreads}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flagged Messages</CardTitle>
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardDescription>Threads affected {stats.flaggedThreads}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.flaggedMessages}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Open Escalations</CardTitle>
            <GitPullRequest className="h-8 w-8 text-accent" />
          </div>
          <CardDescription>
            Resolved {stats.resolvedThreads + stats.closedThreads + stats.archivedThreads}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.openEscalations}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Avg First Response</CardTitle>
            <Clock className="h-8 w-8 text-secondary" />
          </div>
          <CardDescription>
            Based on {stats.totalMeasuredResponses} responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {formatMinutes(stats.avgFirstResponseMinutes)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Responses ≤ 1h</CardTitle>
            <Timer className="h-8 w-8 text-primary" />
          </div>
          <CardDescription>Customer SLA coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {formatPercentage(stats.responsesWithinHourRate)}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 xl:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unread Messages</CardTitle>
            <MailWarning className="h-8 w-8 text-secondary" />
          </div>
          <CardDescription>Across customers and staff</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.totalUnread}</p>
        </CardContent>
      </Card>
    </div>
  )
}
