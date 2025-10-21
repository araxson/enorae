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
      {salon.cover_image_url && (
        <div className="aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted relative mb-6">
          <Image
            src={salon.cover_image_url}
            alt={salon.name || 'Salon'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex gap-4 items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            {salon.logo_url && (
              <div className="h-20 w-20 overflow-hidden rounded-lg bg-muted relative">
                <Image src={salon.logo_url} alt={salon.name || 'Logo'} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <h1 className="scroll-m-20">{salon.name || 'Unnamed Salon'}</h1>
              {salon.rating !== null && (
                <div className="flex gap-3 items-center">
                  <Star className="h-5 w-5 text-accent" fill="currentColor" />
                  <span className="font-semibold">{salon.rating.toFixed(1)}</span>
                  {salon.review_count !== null && <p className="text-sm text-muted-foreground">({salon.review_count} reviews)</p>}
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
