import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
        <ItemGroup className="gap-3">
          {salon.services_count !== null && (
            <Item variant="muted">
              <ItemHeader className="gap-3">
                <ItemMedia variant="icon">
                  <Tag className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemTitle>Service count</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>{formatNumber(salon.services_count)} services</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon.staff_count !== null && (
            <Item variant="muted">
              <ItemHeader className="gap-3">
                <ItemMedia variant="icon">
                  <Users className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemTitle>Team size</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>{formatNumber(salon.staff_count)} staff members</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon.established_at && (
            <Item variant="muted">
              <ItemHeader className="gap-3">
                <ItemMedia variant="icon">
                  <Calendar className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemTitle>Years active</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Established {new Date(salon.established_at).getFullYear()}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
