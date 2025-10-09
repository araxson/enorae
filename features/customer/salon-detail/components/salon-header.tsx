'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { P, Muted } from '@/components/ui/typography'
import { FavoriteButton } from '@/features/customer/favorites/components/favorite-button'
import { MapPin } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

interface SalonHeaderProps {
  salon: Salon
  media: SalonMedia | null
  isFavorited?: boolean
}

export function SalonHeader({ salon, media, isFavorited = false }: SalonHeaderProps) {
  const images = media?.gallery_urls && media.gallery_urls.length > 0
    ? media.gallery_urls.map((url, index) => ({
        url,
        alt: `${salon.name} - Image ${index + 1}`,
      }))
    : media?.cover_image_url
    ? [{ url: media.cover_image_url, alt: `${salon.name} cover image` }]
    : [
        {
          url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200',
          alt: 'Salon placeholder',
        },
      ]

  const hasMultipleImages = images.length > 1

  return (
    <div className="overflow-hidden rounded-xl border">
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            {hasMultipleImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : (
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
              <Image
                src={images[0].url}
                alt={images[0].alt}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <P className="text-2xl font-semibold leading-tight">{salon.name}</P>
              {salon.business_type && <P className="text-muted-foreground">{salon.business_type}</P>}
            </div>
            {salon.id && (
              <FavoriteButton
                salonId={salon.id}
                initialFavorited={isFavorited}
                variant="default"
              />
            )}
          </div>

          {salon.business_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <Muted>{salon.business_name}</Muted>
            </div>
          )}
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
