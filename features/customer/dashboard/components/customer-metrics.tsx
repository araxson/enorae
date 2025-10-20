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
      accent: 'bg-blue-500/10 text-blue-600',
      progress: metrics.upcomingAppointments > 0 ? 100 : 0,
      progressClass: '[&>div]:bg-blue-600',
      showHearts: undefined,
    },
    {
      label: 'Completed',
      value: metrics.completedAppointments,
      description: 'Total visits',
      icon: CheckCircle,
      accent: 'bg-green-500/10 text-green-600',
      progress:
        totalActivity > 0
          ? Math.round((metrics.completedAppointments / totalActivity) * 100)
          : 0,
      progressClass: '[&>div]:bg-green-600',
      showHearts: undefined,
    },
    {
      label: 'Favorites',
      value: metrics.favorites,
      description: 'Saved salons',
      icon: Heart,
      accent: 'bg-pink-500/10 text-pink-600',
      progress: undefined,
      progressClass: undefined,
      showHearts: metrics.favorites,
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">Your activity</p>
        <Badge variant={activityVariant} className="gap-1 text-xs">
          <TrendingUp className="h-3 w-3" />
          {activityLevel} user
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, description, icon: Icon, accent, progress, showHearts, progressClass }) => (
          <Card key={label} className="overflow-hidden border border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardDescription>{label}</CardDescription>
                <CardTitle>
                  {value}
                </CardTitle>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{description}</p>

              {typeof showHearts === 'number' && showHearts > 0 ? (
                <div className="flex flex-wrap items-center gap-1">
                  {Array.from({ length: Math.min(showHearts, 5) }).map((_, index) => (
                    <Heart key={index} className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                  ))}
                  {showHearts > 5 && (
                    <span className="text-xs text-muted-foreground">+{showHearts - 5}</span>
                  )}
                </div>
              ) : (
                <Progress value={progress} className={`h-1.5 ${progressClass ?? ''}`} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
