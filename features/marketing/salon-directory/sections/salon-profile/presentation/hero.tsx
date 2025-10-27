import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Star } from 'lucide-react'
import type { Salon } from './types'

interface SalonHeroProps {
  salon: Salon
}

export function SalonHero({ salon }: SalonHeroProps) {
  return (
    <ItemGroup className="gap-4">
      <Item className="flex-col gap-4" variant="muted">
        <ItemHeader>
          <h1 className="scroll-m-20">{salon['name'] || 'Unnamed Salon'}</h1>
        </ItemHeader>
        {salon['rating_average'] !== null && (
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Star className="size-4 text-accent" fill="currentColor" aria-hidden="true" />
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
          <ItemContent>
            <ItemDescription>{salon['short_description']}</ItemDescription>
          </ItemContent>
        ) : null}
      </Item>

      <Item variant="outline">
        <ItemActions className="w-full justify-end gap-3">
          <ButtonGroup className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">Book Appointment</Link>
            </Button>
            <Button size="lg" variant="outline">
              Share
            </Button>
          </ButtonGroup>
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
