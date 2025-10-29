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
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <h3 className="text-lg font-semibold tracking-tight">Quick Stats</h3>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="gap-3">
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
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
