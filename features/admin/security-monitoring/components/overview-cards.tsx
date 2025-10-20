import { Activity, AlertTriangle, ShieldAlert, UserX, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SecurityMonitoringSnapshot, SecurityMetric } from '../api/types'

interface OverviewCardsProps {
  snapshot: SecurityMonitoringSnapshot
}

const STATUS_STYLES: Record<SecurityMetric['status'], string> = {
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  healthy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-red-200 bg-red-50 text-red-700',
  unknown: 'border-border bg-muted text-muted-foreground',
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
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle>{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(overview[key as OverviewKey] ?? 0)}
              </div>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {metrics.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.slice(0, 8).map((metric) => (
            <Card key={metric.key}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle>
                  {metric.label}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn('text-xs capitalize', STATUS_STYLES[metric.status] ?? STATUS_STYLES.unknown)}
                >
                  {statusLabel(metric.status)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(metric.value)}
                </div>
                <CardDescription>
                  {metric.threshold
                    ? `Threshold ${metric.threshold.toLocaleString('en-US')}`
                    : 'No threshold configured'}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
