import type { ComponentProps } from 'react'
import { Activity, AlertTriangle, ShieldAlert, UserX, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SecurityMonitoringSnapshot, SecurityMetric } from '@/features/admin/security-monitoring/api/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

interface OverviewCardsProps {
  snapshot: SecurityMonitoringSnapshot
}

const STATUS_VARIANT: Record<SecurityMetric['status'], ComponentProps<typeof Badge>['variant']> = {
  ok: 'secondary',
  healthy: 'secondary',
  info: 'secondary',
  warning: 'default',
  critical: 'destructive',
  unknown: 'outline',
}

const overviewDescriptors = [
  {
    key: 'totalAuditEvents',
    label: 'Audit Events',
    description: 'Captured in selected window',
    icon: Activity,
  },
  {
    key: 'highSeverityEvents',
    label: 'High Severity',
    description: 'Critical or error level events',
    icon: AlertTriangle,
  },
  {
    key: 'failedLoginAttempts',
    label: 'Failed Logins',
    description: 'Authentication failures detected',
    icon: UserX,
  },
  {
    key: 'activeIncidents',
    label: 'Active Incidents',
    description: 'Incidents needing response',
    icon: ShieldAlert,
  },
  {
    key: 'blockedSessions',
    label: 'Blocked Sessions',
    description: 'Sessions halted for security',
    icon: Lock,
  },
] as const

type OverviewKey = typeof overviewDescriptors[number]['key']

const formatNumber = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 })

const statusLabel = (status: SecurityMetric['status']) =>
  status
    .split(/[_-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

export function OverviewCards({ snapshot }: OverviewCardsProps) {
  const { overview, metrics } = snapshot

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {overviewDescriptors.map(({ key, label, description, icon: Icon }) => (
          <Card key={key}>
            <CardHeader>
              <ItemGroup>
                <Item className="items-start justify-between gap-2">
                  <ItemContent>
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <Icon className="size-4" aria-hidden="true" />
                  </ItemActions>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <strong>{formatNumber(overview[key as OverviewKey] ?? 0)}</strong>
            </CardContent>
          </Card>
        ))}
      </div>

      {metrics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.slice(0, 8).map((metric) => (
            <Card key={metric.key}>
              <CardHeader>
                <ItemGroup>
                <Item className="items-start justify-between gap-2">
                  <ItemContent>
                    <CardTitle>{metric.label}</CardTitle>
                  </ItemContent>
                    <ItemActions className="flex-none">
                      <Badge variant={STATUS_VARIANT[metric.status] ?? 'outline'}>
                        {statusLabel(metric.status)}
                      </Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <strong>{formatNumber(metric.value)}</strong>
                  <CardDescription>
                    {metric.threshold
                      ? `Threshold ${metric.threshold.toLocaleString('en-US')}`
                      : 'No threshold configured'}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No metric insights yet</EmptyTitle>
            <EmptyDescription>Trend cards populate once observability signals meet the minimum sample size.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
