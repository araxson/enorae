import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { MessageStats } from '@/features/admin/messages/api/queries'
import { MessageSquare, AlertTriangle, ShieldAlert, GitPullRequest, Clock, Timer, MailWarning } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

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
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Total Threads</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
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
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Urgent Threads</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <AlertTriangle className="h-8 w-8 text-accent" />
              </ItemActions>
            </Item>
          </ItemGroup>
          <CardDescription>High priority {stats.highPriorityThreads}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.urgentThreads}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Flagged Messages</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </ItemActions>
            </Item>
          </ItemGroup>
          <CardDescription>Threads affected {stats.flaggedThreads}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.flaggedMessages}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Open Escalations</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <GitPullRequest className="h-8 w-8 text-accent" />
              </ItemActions>
            </Item>
          </ItemGroup>
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
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Avg First Response</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <Clock className="h-8 w-8 text-secondary" />
              </ItemActions>
            </Item>
          </ItemGroup>
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
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Responses ≤ 1h</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <Timer className="h-8 w-8 text-primary" />
              </ItemActions>
            </Item>
          </ItemGroup>
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
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Unread Messages</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <MailWarning className="h-8 w-8 text-secondary" />
              </ItemActions>
            </Item>
          </ItemGroup>
          <CardDescription>Across customers and staff</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.totalUnread}</p>
        </CardContent>
      </Card>
    </div>
  )
}
