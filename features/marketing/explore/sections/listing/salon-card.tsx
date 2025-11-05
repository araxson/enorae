'use client'

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { MapPin, Star } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { listingCopy } from './listing.data'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonCardProps {
  salon: Salon
  onBook: (slug?: string | null) => void
}

export const SalonCard = memo(function SalonCard({ salon, onBook }: SalonCardProps) {
  const location =
    salon['formatted_address'] ||
    (salon['city'] && salon['state_province']
      ? `${salon['city']}, ${salon['state_province']}`
      : salon['city'] || 'Location coming soon')

  const description = salon['short_description'] || undefined
  const previewDescription = salon['full_description'] || listingCopy.hoverPreviewFallback
  const ratingValue =
    typeof salon['rating_average'] === 'number'
      ? salon['rating_average']
      : Number(salon['rating_average'] ?? 0)

  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <div className="h-full">
          <Card>
            <CardHeader>
              <CardTitle>{salon['name'] ?? 'Salon'}</CardTitle>
              {description ? (
                <CardDescription className="line-clamp-2">{description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-3">
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <MapPin className="size-4" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>{location}</ItemDescription>
                  </ItemContent>
                </Item>
                {ratingValue ? (
                  <Item variant="muted">
                    <ItemMedia variant="icon">
                      <Star className="size-4" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{ratingValue.toFixed(1)}</ItemTitle>
                      <ItemDescription>{salon['rating_count'] ?? 0} reviews</ItemDescription>
                    </ItemContent>
                  </Item>
                ) : null}
              </ItemGroup>
            </CardContent>
            <CardFooter>
              <Button size="lg" onClick={() => onBook(salon['slug'])}>
                {listingCopy.ctaLabel}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {listingCopy.hoverPreviewTitle}
          </p>
          <p className="text-sm leading-snug text-muted-foreground line-clamp-4">
            {previewDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{salon['name'] ?? 'Salon'}</span>
          <span>•</span>
          <span>{location}</span>
          {ratingValue ? (
            <>
              <span>•</span>
              <span>{ratingValue.toFixed(1)} rating</span>
            </>
          ) : null}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
})
