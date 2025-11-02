'use client'

import { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
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

export const SalonCard = memo(function SalonCard({ salon, index, onBook }: SalonCardProps) {
  const location =
    salon['formatted_address'] ||
    (salon['city'] && salon['state_province']
      ? `${salon['city']}, ${salon['state_province']}`
      : salon['city'] || 'Location coming soon')

  const description = salon['short_description'] || undefined

  return (
    <Item
      key={salon['id'] ?? salon['slug'] ?? `salon-${index}`}
      variant="outline"
      className="flex h-full flex-col gap-4"
    >
      <ItemHeader className="flex flex-col gap-2">
        <ItemTitle>{salon['name'] ?? 'Salon'}</ItemTitle>
        {description ? (
          <ItemDescription className="line-clamp-2">{description}</ItemDescription>
        ) : null}
      </ItemHeader>
      <ItemContent className="flex-1">
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
      </ItemContent>
      <ItemFooter>
        <Button className="w-full" onClick={() => onBook(salon['slug'])}>
          {listingCopy.ctaLabel}
        </Button>
      </ItemFooter>
    </Item>
  )
})
