import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, CheckCircle, Heart, TrendingUp } from 'lucide-react'

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

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Your activity</p>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3 w-3" />
          <Badge variant={activityVariant}>{activityLevel} user</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, description, icon: Icon, progress, showHearts }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-foreground">{value}</p>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              {typeof showHearts === 'number' && showHearts > 0 ? (
                <div className="flex flex-wrap items-center gap-1 pt-3">
                  {Array.from({ length: Math.min(showHearts, 5) }).map((_, index) => (
                    <Heart key={index} className="h-3.5 w-3.5" aria-hidden="true" />
                  ))}
                  {showHearts > 5 && (
                    <p className="text-xs text-muted-foreground">+{showHearts - 5}</p>
                  )}
                </div>
              ) : (
                <div className="pt-3">
                  <Progress value={progress ?? 0} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
