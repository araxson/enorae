import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, CheckCircle, Heart, TrendingUp } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface CustomerMetricsProps {
  metrics: {
    upcomingAppointments: number
    completedAppointments: number
    favorites: number
  }
}

export function CustomerMetrics({ metrics }: CustomerMetricsProps) {
  const totalActivity = metrics.upcomingAppointments + metrics.completedAppointments
  const activityLevel = totalActivity > 10 ? 'Active' : totalActivity > 5 ? 'Regular' : 'New'
  const activityVariant = totalActivity > 10 ? 'default' : totalActivity > 5 ? 'secondary' : 'outline'

  const cards = [
    {
      label: 'Upcoming',
      value: metrics.upcomingAppointments,
      description: 'Scheduled bookings',
      icon: Calendar,
      progress: metrics.upcomingAppointments > 0 ? 100 : 0,
      showHearts: undefined,
    },
    {
      label: 'Completed',
      value: metrics.completedAppointments,
      description: 'Total visits',
      icon: CheckCircle,
      progress:
        totalActivity > 0
          ? Math.round((metrics.completedAppointments / totalActivity) * 100)
          : 0,
      showHearts: undefined,
    },
    {
      label: 'Favorites',
      value: metrics.favorites,
      description: 'Saved salons',
      icon: Heart,
      progress: undefined,
      showHearts: metrics.favorites,
    },
  ]

  const hasActivity =
    metrics.upcomingAppointments > 0 ||
    metrics.completedAppointments > 0 ||
    metrics.favorites > 0

  return (
    <section className="space-y-4">
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemDescription>Your activity</ItemDescription>
          </ItemContent>
          <ItemActions className="flex-none items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            <Badge variant={activityVariant}>{activityLevel} user</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, description, icon: Icon, progress, showHearts }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                <Item>
                  <ItemMedia variant="icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <span className="text-2xl font-semibold text-foreground">{value}</span>
                  </ItemContent>
                </Item>
              </ItemGroup>

              {typeof showHearts === 'number' && showHearts > 0 ? (
                <ItemGroup className="pt-3">
                  <Item variant="muted" size="sm">
                    <ItemMedia variant="icon">
                      <Heart className="h-4 w-4" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <div className="flex flex-wrap items-center gap-1">
                        {Array.from({ length: Math.min(showHearts, 5) }).map((_, index) => (
                          <Heart key={index} className="h-3.5 w-3.5" aria-hidden="true" />
                        ))}
                        {showHearts > 5 ? (
                          <ItemDescription>+{showHearts - 5}</ItemDescription>
                        ) : null}
                      </div>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              ) : (
                <div className="pt-3">
                  <Progress value={progress ?? 0} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasActivity ? (
        <Card>
          <CardContent className="p-6">
            <Empty>
              <EmptyMedia variant="icon">
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No activity yet</EmptyTitle>
                <EmptyDescription>
                  Start booking appointments and saving favorites to build your history.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Returning here after a visit will show your progress and rewards.
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}
