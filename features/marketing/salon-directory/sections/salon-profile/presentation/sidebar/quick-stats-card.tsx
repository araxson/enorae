import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Tag, Users, Calendar } from 'lucide-react'
import type { Salon } from '../types'

interface QuickStatsCardProps {
  salon: Salon
}

export function QuickStatsCard({ salon }: QuickStatsCardProps) {
  if (
    salon.services_count === null &&
    salon.staff_count === null &&
    !salon.established_at
  ) {
    return null
  }

  const formatNumber = (value: number | null | undefined) =>
    value == null ? null : new Intl.NumberFormat().format(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="group/item-group flex flex-col gap-3"
          data-slot="item-group"
          role="list"
        >
          {salon.services_count !== null && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Tag className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Service count</ItemTitle>
                <ItemDescription>{formatNumber(salon.services_count)} services</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon.staff_count !== null && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Users className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Team size</ItemTitle>
                <ItemDescription>{formatNumber(salon.staff_count)} staff members</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon.established_at && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Calendar className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Years active</ItemTitle>
                <ItemDescription>
                  Established {new Date(salon.established_at).getFullYear()}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
