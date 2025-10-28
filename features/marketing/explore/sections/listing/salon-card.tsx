'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { MapPin, Star } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { listingCopy } from './listing.data'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonCardProps {
  salon: Salon
  index: number
  onBook: (slug?: string | null) => void
}

export function SalonCard({ salon, index, onBook }: SalonCardProps) {
  const location =
    salon['formatted_address'] ||
    (salon['city'] && salon['state_province']
      ? `${salon['city']}, ${salon['state_province']}`
      : salon['city'] || 'Location coming soon')

  const description = salon['short_description'] || undefined

  return (
    <Card
      key={salon['id'] ?? salon['slug'] ?? `salon-${index}`}
      className="flex h-full flex-col"
    >
      <CardHeader>
        <CardTitle>{salon['name'] ?? 'Salon'}</CardTitle>
        {description ? (
          <div className="line-clamp-2">
            <CardDescription>{description}</CardDescription>
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex-1">
          <ItemGroup>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <MapPin className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>{location}</ItemDescription>
              </ItemContent>
            </Item>
            {salon['rating_average'] ? (
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <Star className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{Number(salon['rating_average']).toFixed(1)}</ItemTitle>
                  <ItemDescription>{salon['rating_count'] ?? 0} reviews</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}
          </ItemGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onBook(salon['slug'])}>
          {listingCopy.ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
