import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemGroup,
} from '@/components/ui/item'

interface StaffMetricsProps {
  metrics: {
    todayAppointments: number
    weekAppointments: number
    monthCompleted: number
  }
}

export function StaffMetrics({ metrics }: StaffMetricsProps) {
  const weekProgress = metrics.weekAppointments > 0 ? (metrics.todayAppointments / metrics.weekAppointments) * 100 : 0
  const performance = metrics.monthCompleted > 30 ? 'Excellent' : metrics.monthCompleted > 15 ? 'Good' : 'Getting Started'
  const performanceVariant = metrics.monthCompleted > 30 ? 'default' : metrics.monthCompleted > 15 ? 'secondary' : 'outline'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Performance</h3>
        <Badge variant={performanceVariant}>
          <TrendingUp className="mr-1 h-3 w-3" />
          {performance}
        </Badge>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>Today</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.todayAppointments}</div>
            <p className="mt-1 text-xs text-muted-foreground">Scheduled for today</p>
            {metrics.todayAppointments > 0 && (
              <div className="mt-2 space-y-1">
                <Progress value={weekProgress} />
                <p className="text-xs text-muted-foreground">{Math.round(weekProgress)}% of weekly</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>This Week</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.weekAppointments}</div>
            <p className="mt-1 text-xs text-muted-foreground">Total appointments</p>
            {metrics.weekAppointments > 0 && (
              <div className="mt-2 space-y-1">
                <Progress
                  value={Math.min((metrics.weekAppointments / 21) * 100, 100)}
                />
                <p className="text-xs text-muted-foreground">Weekly capacity assumes 21 slots</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>This Month</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.monthCompleted}</div>
            <p className="mt-1 text-xs text-muted-foreground">Completed</p>
            {metrics.monthCompleted > 0 && (
              <div className="mt-2 space-y-1">
                <Progress value={Math.min((metrics.monthCompleted / 50) * 100, 100)} />
                <p className="text-xs text-muted-foreground">Goal: 50 appointments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
