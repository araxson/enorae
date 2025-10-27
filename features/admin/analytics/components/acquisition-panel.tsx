import { Users, Globe2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <Users className="h-4 w-4" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>User Acquisition</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemDescription>New users in last 7 days</ItemDescription>
              <span className="text-2xl font-semibold">
                {newUsersLast7Days.toLocaleString('en-US')}
              </span>
            </ItemContent>
            <ItemActions>
              <Badge variant={deltaPositive ? 'secondary' : 'destructive'}>
                {deltaPositive ? '+' : ''}
                {deltaLast7Days.toLocaleString('en-US')} vs prior 7d
              </Badge>
            </ItemActions>
          </Item>
        </ItemGroup>

        <div className="grid gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Top roles</p>
            {byRole.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No role distribution yet</EmptyTitle>
                  <EmptyDescription>Role-level adoption appears after new users complete onboarding.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup>
                {byRole.map((item) => (
                  <Item key={item.label} variant="outline">
                    <ItemContent>
                      <ItemTitle>{item.label}</ItemTitle>
                      <ItemDescription>
                        {item.count.toLocaleString('en-US')} users · {(item.percentage * 100).toFixed(1)}%
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Globe2 className="h-3 w-3" />
              Top countries
            </p>
            {byCountry.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No geographic acquisition data</EmptyTitle>
                  <EmptyDescription>Country insights populate once location telemetry is available.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup>
                {byCountry.map((item) => (
                  <Item key={item.label} variant="outline">
                    <ItemContent>
                      <ItemTitle>{item.label}</ItemTitle>
                      <ItemDescription>
                        {item.count.toLocaleString('en-US')} users · {(item.percentage * 100).toFixed(1)}%
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
