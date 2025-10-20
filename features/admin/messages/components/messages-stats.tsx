import { Card } from '@/components/ui/card'
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
            <p className="leading-7 text-sm text-muted-foreground">Total Threads</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold">{stats.totalThreads}</h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">
              Open {stats.openThreads} · In progress {stats.inProgressThreads}
            </small>
          </div>
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">Urgent Threads</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold text-orange-500">{stats.urgentThreads}</h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">
              High priority {stats.highPriorityThreads}
            </small>
          </div>
          <AlertTriangle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">Flagged Messages</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold text-red-500">{stats.flaggedMessages}</h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">
              Threads affected {stats.flaggedThreads}
            </small>
          </div>
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">Open Escalations</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold text-amber-500">{stats.openEscalations}</h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">
              Resolved {stats.resolvedThreads + stats.closedThreads + stats.archivedThreads}
            </small>
          </div>
          <GitPullRequest className="h-8 w-8 text-amber-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">Avg First Response</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold">{formatMinutes(stats.avgFirstResponseMinutes)}</h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">
              Based on {stats.totalMeasuredResponses} responses
            </small>
          </div>
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">Responses ≤ 1h</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold text-emerald-600">
              {formatPercentage(stats.responsesWithinHourRate)}
            </h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">Customer SLA coverage</small>
          </div>
          <Timer className="h-8 w-8 text-emerald-600" />
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 xl:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">Unread Messages</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-2xl font-bold">{stats.totalUnread}</h3>
            <small className="text-sm font-medium leading-none text-xs text-muted-foreground">Across customers and staff</small>
          </div>
          <MailWarning className="h-8 w-8 text-sky-500" />
        </div>
      </Card>
    </div>
  )
}
