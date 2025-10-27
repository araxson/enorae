import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
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
    <div>
      <div className="flex gap-4 items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-3">
              <h1 className="scroll-m-20">{salon['name'] || 'Unnamed Salon'}</h1>
              {salon['rating_average'] !== null && (
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <Star className="size-4 text-accent" fill="currentColor" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{salon['rating_average'].toFixed(1)}</ItemTitle>
                    {salon['rating_count'] !== null && (
                      <ItemDescription>{salon['rating_count']} reviews</ItemDescription>
                    )}
                  </ItemContent>
                </Item>
              )}
            </div>
          </div>

          {salon['short_description'] && (
            <p className="leading-7 text-muted-foreground">{salon['short_description']}</p>
          )}
        </div>

        <ButtonGroup className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/signup">Book Appointment</Link>
          </Button>
          <Button size="lg" variant="outline">
            Share
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
