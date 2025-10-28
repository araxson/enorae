'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DollarSign, Calendar, TrendingUp, Star, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-start justify-between">
          <div className="space-y-1">
            <ItemDescription>Lifetime value</ItemDescription>
            <ItemTitle>${metrics.lifetime_value.toFixed(2)}</ItemTitle>
          </div>
          <ItemActions className="flex-none">
            <DollarSign className="size-8 text-primary" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{metrics.total_visits} visits recorded</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-start justify-between">
          <div className="space-y-1">
            <ItemDescription>Average ticket</ItemDescription>
            <ItemTitle>${metrics.avg_ticket.toFixed(2)}</ItemTitle>
          </div>
          <ItemActions className="flex-none">
            <TrendingUp className="size-8 text-secondary" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>${metrics.total_spent.toFixed(2)} spent to date</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-start justify-between">
          <div className="space-y-1">
            <ItemDescription>Visit frequency</ItemDescription>
            <ItemTitle>{visitStats.avg_days_between_visits}d</ItemTitle>
          </div>
          <ItemActions className="flex-none">
            <Calendar className="size-8 text-primary" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{visitStats.visit_frequency}</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-start justify-between">
          <div className="space-y-1">
            <ItemTitle>Reliability</ItemTitle>
            <ItemDescription>Cancellation and no-show trends</ItemDescription>
          </div>
          <ItemActions className="flex-none">
            <Star className="size-8 text-accent" />
          </ItemActions>
        </ItemHeader>
        <ItemContent className="flex gap-2">
          <Badge variant={metrics.cancellation_rate < 10 ? 'default' : 'destructive'}>
            {metrics.cancellation_rate.toFixed(0)}% cancel
          </Badge>
          <Badge variant={metrics.no_show_rate < 5 ? 'default' : 'destructive'}>
            {metrics.no_show_rate.toFixed(0)}% no-show
          </Badge>
        </ItemContent>
      </Item>

      <Item variant="outline" className="col-span-full flex-col gap-4 md:col-span-2">
        <ItemHeader className="items-start">
          <ItemTitle>Last Visit</ItemTitle>
          <ItemDescription>
            {metrics.last_visit_date
              ? formatDistanceToNow(new Date(metrics.last_visit_date), { addSuffix: true })
              : 'No visits recorded'}
          </ItemDescription>
        </ItemHeader>
        <ItemContent className="flex items-center justify-between">
          <div className="space-y-1">
            <ItemDescription>First visit</ItemDescription>
            <ItemTitle>
              {metrics.first_visit_date
                ? formatDistanceToNow(new Date(metrics.first_visit_date), { addSuffix: true })
                : 'Unavailable'}
            </ItemTitle>
          </div>
          {favoriteStaff ? (
            <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="h-12" decorative />
              <Users className="size-5 text-muted-foreground" />
              <div className="space-y-1">
                <ItemDescription>Favorite staff</ItemDescription>
                <ItemTitle>{favoriteStaff.name}</ItemTitle>
              </div>
            </div>
          ) : null}
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
