import { Users, Globe2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/admin-analytics-types'

interface AcquisitionPanelProps {
  acquisition: PlatformAnalyticsSnapshot['acquisition']
}

export function AcquisitionPanel({ acquisition }: AcquisitionPanelProps) {
  const { newUsersLast7Days, deltaLast7Days, byRole, byCountry } = acquisition
  const deltaPositive = deltaLast7Days >= 0

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <CardTitle>User Acquisition</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">New users in last 7 days</p>
            <p className="text-2xl font-semibold">{newUsersLast7Days.toLocaleString('en-US')}</p>
          </div>
          <div className="text-xs">
            <Badge variant={deltaPositive ? 'secondary' : 'destructive'}>
              {deltaPositive ? '+' : ''}
              {deltaLast7Days.toLocaleString('en-US')} vs prior 7d
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Top roles</p>
            {byRole.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent user role data.</p>
            ) : (
              <ul className="space-y-2">
                {byRole.map((item) => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.count.toLocaleString('en-US')} · {(item.percentage * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Globe2 className="h-3 w-3" />
              Top countries
            </p>
            {byCountry.length === 0 ? (
              <p className="text-xs text-muted-foreground">No geographic acquisition data.</p>
            ) : (
              <ul className="space-y-2">
                {byCountry.map((item) => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.count.toLocaleString('en-US')} · {(item.percentage * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
