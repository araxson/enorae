import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
              <h1 className="scroll-m-20">{salon.name || 'Unnamed Salon'}</h1>
              {salon.rating_average !== null && (
                <div className="flex gap-3 items-center">
                  <Star className="h-5 w-5 text-accent" fill="currentColor" />
                  <span>{salon.rating_average.toFixed(1)}</span>
                  {salon.rating_count !== null && <p className="text-muted-foreground">({salon.rating_count} reviews)</p>}
                </div>
              )}
            </div>
          </div>

          {salon.short_description && (
            <p className="leading-7 text-muted-foreground">{salon.short_description}</p>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <Button size="lg" asChild>
            <Link href="/signup">Book Appointment</Link>
          </Button>
          <Button size="lg" variant="outline">
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
