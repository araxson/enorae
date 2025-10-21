import { MessageSquare, AlertTriangle, Clock, ShieldAlert, Gauge } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
type ModerationStatsProps = {
  stats: {
    totalReviews: number
    flaggedReviews: number
    pendingReviews: number
    highRiskReviews: number
    averageSentiment: number
    averageQuality: number
  }
}

export function ModerationStats({ stats }: ModerationStatsProps) {
  const cards = [
    {
      label: 'Total reviews',
      value: stats.totalReviews,
      icon: MessageSquare,
      accent: 'text-primary',
    },
    {
      label: 'Flagged reviews',
      value: stats.flaggedReviews,
      icon: AlertTriangle,
      accent: 'text-destructive',
    },
    {
      label: 'Pending response',
      value: stats.pendingReviews,
      icon: Clock,
      accent: 'text-accent',
    },
    {
      label: 'High risk reviews',
      value: stats.highRiskReviews,
      icon: ShieldAlert,
      accent: 'text-destructive',
    },
    {
      label: 'Avg sentiment',
      value: stats.averageSentiment.toFixed(2),
      icon: Gauge,
      accent: 'text-secondary',
    },
    {
      label: 'Avg quality score',
      value: `${stats.averageQuality}%`,
      icon: Gauge,
      accent: 'text-primary',
    },
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <Card key={label}>
          <CardHeader className="p-4">
            <div className="flex items-start justify-between gap-4">
              <CardDescription>{label}</CardDescription>
              <Icon className={`h-4 w-4 ${accent}`} aria-hidden="true" />
            </div>
            <CardTitle>
              {typeof value === 'number' ? value : value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
