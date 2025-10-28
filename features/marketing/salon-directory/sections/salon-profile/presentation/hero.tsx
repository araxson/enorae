import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Star } from 'lucide-react'
import type { Salon } from './types'

interface SalonHeroProps {
  salon: Salon
}

export function SalonHero({ salon }: SalonHeroProps) {
  return (
    <div
      className="group/item-group flex flex-col gap-4"
      data-slot="item-group"
      role="list"
    >
      <Item variant="muted">
        <ItemContent>
          <div className="flex flex-col gap-4">
            <ItemTitle>{salon['name'] || 'Unnamed Salon'}</ItemTitle>
            {salon['rating_average'] !== null && (
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <Star className="size-4" fill="currentColor" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{salon['rating_average'].toFixed(1)}</ItemTitle>
                  {salon['rating_count'] !== null && (
                    <ItemDescription>{salon['rating_count']} reviews</ItemDescription>
                  )}
                </ItemContent>
              </Item>
            )}
            {salon['short_description'] ? (
              <ItemDescription>{salon['short_description']}</ItemDescription>
            ) : null}
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline">
        <ItemActions>
          <div className="flex w-full justify-end">
            <ButtonGroup aria-label="Salon hero actions">
              <Button size="lg" asChild>
                <Link href="/signup">Book Appointment</Link>
              </Button>
              <Button size="lg" type="button" variant="outline">
                Share
              </Button>
            </ButtonGroup>
          </div>
        </ItemActions>
      </Item>
    </div>
  )
}
