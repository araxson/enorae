'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardDescription>Lifetime value</CardDescription>
            <CardTitle>${metrics.lifetime_value.toFixed(2)}</CardTitle>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>{metrics.total_visits} visits recorded</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardDescription>Average ticket</CardDescription>
            <CardTitle>${metrics.avg_ticket.toFixed(2)}</CardTitle>
          </div>
          <TrendingUp className="h-8 w-8 text-secondary" />
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>${metrics.total_spent.toFixed(2)} spent to date</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardDescription>Visit frequency</CardDescription>
            <CardTitle>{visitStats.avg_days_between_visits}d</CardTitle>
          </div>
          <Calendar className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>{visitStats.visit_frequency}</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle>Reliability</CardTitle>
            <CardDescription>Cancellation and no-show trends</CardDescription>
          </div>
          <Star className="h-8 w-8 text-accent" />
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
          <div className="space-y-1">
            <CardDescription>First visit</CardDescription>
            <CardTitle>
              {metrics.first_visit_date
                ? formatDistanceToNow(new Date(metrics.first_visit_date), { addSuffix: true })
                : 'Unavailable'}
            </CardTitle>
          </div>
          {favoriteStaff ? (
            <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="h-12" decorative />
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <CardDescription>Favorite staff</CardDescription>
                <CardTitle>{favoriteStaff.name}</CardTitle>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
