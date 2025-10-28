import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-secondary/10">
                <Activity className="size-6 text-secondary" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemTitle>Total Events (24h)</ItemTitle>
              <ItemDescription>Audit log volume in the last day</ItemDescription>
            </div>
          </div>
        </ItemHeader>
        <ItemContent>
          <span className="text-xl font-semibold">{stats.totalEvents}</span>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary/10">
                <CheckCircle2 className="size-6 text-primary" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemTitle>Success Rate</ItemTitle>
              <ItemDescription>Percentage of successful actions</ItemDescription>
            </div>
          </div>
        </ItemHeader>
        <ItemContent>
          <span className="text-xl font-semibold">{stats.successRate.toFixed(1)}%</span>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-destructive/10">
                <XCircle className="size-6 text-destructive" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemTitle>Failed Actions</ItemTitle>
              <ItemDescription>Errors encountered in the last day</ItemDescription>
            </div>
          </div>
        </ItemHeader>
        <ItemContent>
          <span className="text-xl font-semibold">{stats.failedActions}</span>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-accent/10">
                <AlertTriangle className="size-6 text-accent" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemTitle>Critical Events</ItemTitle>
              <ItemDescription>High severity occurrences</ItemDescription>
            </div>
          </div>
        </ItemHeader>
        <ItemContent>
          <span className="text-xl font-semibold">{stats.criticalEvents}</span>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-accent/10">
                <AlertTriangle className="size-6 text-accent" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemTitle>Warnings</ItemTitle>
              <ItemDescription>Medium severity alerts</ItemDescription>
            </div>
          </div>
        </ItemHeader>
        <ItemContent>
          <span className="text-xl font-semibold">{stats.warningEvents}</span>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
