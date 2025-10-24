'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lifetime Value</CardTitle>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <CardDescription>{metrics.total_visits} visits recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${metrics.lifetime_value.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Avg Ticket</CardTitle>
            <TrendingUp className="h-8 w-8 text-secondary" />
          </div>
          <CardDescription>${metrics.total_spent.toFixed(2)} spent to date</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${metrics.avg_ticket.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Visit Frequency</CardTitle>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardDescription>{visitStats.visit_frequency}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{visitStats.avg_days_between_visits}d</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reliability</CardTitle>
            <Star className="h-8 w-8 text-accent" />
          </div>
          <CardDescription>Cancellation and no-show trends</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 pt-0">
          <Badge variant={metrics.cancellation_rate < 10 ? 'default' : 'destructive'}>
            {metrics.cancellation_rate.toFixed(0)}% cancel
          </Badge>
          <Badge variant={metrics.no_show_rate < 5 ? 'default' : 'destructive'}>
            {metrics.no_show_rate.toFixed(0)}% no-show
          </Badge>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Last Visit</CardTitle>
          <CardDescription>
            {metrics.last_visit_date
              ? formatDistanceToNow(new Date(metrics.last_visit_date), { addSuffix: true })
              : 'No visits recorded'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">First visit</p>
            <p className="text-lg font-semibold">
              {metrics.first_visit_date
                ? formatDistanceToNow(new Date(metrics.first_visit_date), { addSuffix: true })
                : 'Unavailable'}
            </p>
          </div>
          {favoriteStaff ? (
            <div className="flex items-center gap-2 border-l pl-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Favorite Staff</p>
                <p className="font-semibold">{favoriteStaff.name}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
