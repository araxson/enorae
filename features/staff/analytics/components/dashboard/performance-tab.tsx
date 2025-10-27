import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StaffPerformanceMetrics } from '@/features/staff/analytics/api/queries'
import { formatPercentage } from './utils'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface PerformanceTabProps {
  metrics: StaffPerformanceMetrics
}

export function PerformanceTab({ metrics }: PerformanceTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Appointment Statistics</CardTitle>
                <CardDescription>Your appointment performance metrics</CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-3">
            <Item>
              <ItemContent>
                <ItemDescription>Total Appointments</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline">{metrics.total_appointments}</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemContent>
                <ItemDescription>Completed</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="default">{metrics.completed_appointments}</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemContent>
                <ItemDescription>Cancelled</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="destructive">{metrics.cancelled_appointments}</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemContent>
                <ItemDescription>No Shows</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">{metrics.no_show_appointments}</Badge>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Performance Rates</CardTitle>
                <CardDescription>Completion and cancellation metrics</CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <ItemTitle>Completion Rate</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-sm font-semibold text-primary">
                      {formatPercentage(metrics.completion_rate)}
                    </span>
                  </ItemActions>
                </Item>
              </ItemGroup>
              <Progress value={metrics.completion_rate} className="h-2" />
            </div>
            <div>
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <ItemTitle>Cancellation Rate</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-sm font-semibold text-destructive">
                      {formatPercentage(metrics.cancellation_rate)}
                    </span>
                  </ItemActions>
                </Item>
              </ItemGroup>
              <Progress value={metrics.cancellation_rate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
