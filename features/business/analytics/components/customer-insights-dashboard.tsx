'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Calendar, TrendingUp, Star, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CustomerInsightsDashboardProps {
  metrics: {
    total_visits: number
    total_spent: number
    lifetime_value: number
    avg_ticket: number
    last_visit_date: string | null
    first_visit_date: string | null
    favorite_service_id: string | null
    cancellation_rate: number
    no_show_rate: number
  }
  visitStats: {
    avg_days_between_visits: number
    visit_frequency: string
  }
  favoriteStaff: {
    id: string
    name: string
  } | null
}

export function CustomerInsightsDashboard({
  metrics,
  visitStats,
  favoriteStaff,
}: CustomerInsightsDashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
            <p className="text-2xl font-bold">${metrics.lifetime_value.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.total_visits} visits
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Avg Ticket</p>
            <p className="text-2xl font-bold">${metrics.avg_ticket.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${metrics.total_spent.toFixed(2)} total
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Visit Frequency</p>
            <p className="text-2xl font-bold">
              {visitStats.avg_days_between_visits}d
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {visitStats.visit_frequency}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-purple-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Reliability</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={metrics.cancellation_rate < 10 ? 'default' : 'destructive'}>
                {metrics.cancellation_rate.toFixed(0)}% cancel
              </Badge>
              <Badge variant={metrics.no_show_rate < 5 ? 'default' : 'destructive'}>
                {metrics.no_show_rate.toFixed(0)}% no-show
              </Badge>
            </div>
          </div>
          <Star className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-6 col-span-full md:col-span-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Last Visit</p>
            <p className="text-lg font-semibold">
              {metrics.last_visit_date
                ? formatDistanceToNow(new Date(metrics.last_visit_date), { addSuffix: true })
                : 'Never'}
            </p>
          </div>
          {favoriteStaff && (
            <div className="flex items-center gap-2 border-l pl-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Favorite Staff</p>
                <p className="font-semibold">{favoriteStaff.name}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
