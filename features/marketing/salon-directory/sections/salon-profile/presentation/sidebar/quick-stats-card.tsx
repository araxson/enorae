import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {salon.services_count !== null && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Tag className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>{salon.services_count} Services</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon.staff_count !== null && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Users className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>{salon.staff_count} Staff Members</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon.established_at && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Calendar className="size-4" />
              </ItemMedia>
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
