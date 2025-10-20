import { MessageSquare, AlertTriangle, Clock, ShieldAlert, Gauge } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
      accent: 'text-blue-500',
    },
    {
      label: 'Flagged reviews',
      value: stats.flaggedReviews,
      icon: AlertTriangle,
      accent: 'text-red-500',
    },
    {
      label: 'Pending response',
      value: stats.pendingReviews,
      icon: Clock,
      accent: 'text-orange-500',
    },
    {
      label: 'High risk reviews',
      value: stats.highRiskReviews,
      icon: ShieldAlert,
      accent: 'text-rose-500',
    },
    {
      label: 'Avg sentiment',
      value: stats.averageSentiment.toFixed(2),
      icon: Gauge,
      accent: 'text-purple-500',
    },
    {
      label: 'Avg quality score',
      value: `${stats.averageQuality}%`,
      icon: Gauge,
      accent: 'text-sky-500',
    },
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <Card key={label}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-1">
              <p className="leading-7 text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">
                {typeof value === 'number' ? value : value}
              </p>
            </div>
            <Icon className={`h-4 w-4 ${accent}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
