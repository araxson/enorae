import { Card } from '@/components/ui/card'
import { H3, P, Small } from '@/components/ui/typography'
import type { MessageStats } from '../api/queries'
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
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Total Threads</P>
            <H3 className="text-2xl font-bold">{stats.totalThreads}</H3>
            <Small className="text-xs text-muted-foreground">
              Open {stats.openThreads} · In progress {stats.inProgressThreads}
            </Small>
          </div>
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Urgent Threads</P>
            <H3 className="text-2xl font-bold text-orange-500">{stats.urgentThreads}</H3>
            <Small className="text-xs text-muted-foreground">
              High priority {stats.highPriorityThreads}
            </Small>
          </div>
          <AlertTriangle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Flagged Messages</P>
            <H3 className="text-2xl font-bold text-red-500">{stats.flaggedMessages}</H3>
            <Small className="text-xs text-muted-foreground">
              Threads affected {stats.flaggedThreads}
            </Small>
          </div>
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Open Escalations</P>
            <H3 className="text-2xl font-bold text-amber-500">{stats.openEscalations}</H3>
            <Small className="text-xs text-muted-foreground">
              Resolved {stats.resolvedThreads + stats.closedThreads + stats.archivedThreads}
            </Small>
          </div>
          <GitPullRequest className="h-8 w-8 text-amber-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Avg First Response</P>
            <H3 className="text-2xl font-bold">{formatMinutes(stats.avgFirstResponseMinutes)}</H3>
            <Small className="text-xs text-muted-foreground">
              Based on {stats.totalMeasuredResponses} responses
            </Small>
          </div>
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Responses ≤ 1h</P>
            <H3 className="text-2xl font-bold text-emerald-600">
              {formatPercentage(stats.responsesWithinHourRate)}
            </H3>
            <Small className="text-xs text-muted-foreground">Customer SLA coverage</Small>
          </div>
          <Timer className="h-8 w-8 text-emerald-600" />
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 xl:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <P className="text-sm text-muted-foreground">Unread Messages</P>
            <H3 className="text-2xl font-bold">{stats.totalUnread}</H3>
            <Small className="text-xs text-muted-foreground">Across customers and staff</Small>
          </div>
          <MailWarning className="h-8 w-8 text-sky-500" />
        </div>
      </Card>
    </div>
  )
}
