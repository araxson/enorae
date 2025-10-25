'use client'

import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { FavoriteButton } from '@/features/customer/favorites/components/favorite-button'
import { Clock, MapPin, Star } from 'lucide-react'
import {
  ContactInfo,
} from '@/features/shared/customer-common/components'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons_view']['Row'] & {
  booking_lead_time_hours?: number | null
}
type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

interface SalonHeaderProps {
  salon: Salon
  media: SalonMedia | null
  isFavorited?: boolean
}

export function SalonHeader({ salon, media, isFavorited = false }: SalonHeaderProps) {
  const images = media?.['gallery_urls'] && media['gallery_urls'].length > 0
    ? media['gallery_urls'].map((url, index) => ({
        url,
        alt: `${salon['name']} - Image ${index + 1}`,
      }))
    : media?.['cover_image_url']
    ? [{ url: media['cover_image_url'], alt: `${salon['name']} cover image` }]
    : [
        {
          url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200',
          alt: 'Salon placeholder',
        },
      ]

  const hasMultipleImages = images.length > 1

  return (
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
                        src={image['url']}
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
      </CardContent>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle>{salon['name']}</CardTitle>
            {salon['short_description'] && <CardDescription>{salon['short_description']}</CardDescription>}
          </div>
          {salon['id'] && (
            <FavoriteButton
              salonId={salon['id']}
              initialFavorited={isFavorited}
              variant="default"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="flex flex-wrap items-center gap-4">
          {salon['rating_average'] && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm text-muted-foreground">
                {Number(salon['rating_average']).toFixed(1)}
              </span>
              {salon['rating_count'] && (
                <span className="text-sm text-muted-foreground">
                  ({salon['rating_count']} {salon['rating_count'] === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}
          {salon['formatted_address'] && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{salon['formatted_address']}</span>
            </div>
          )}
          {typeof salon['booking_lead_time_hours'] === 'number' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Booking lead time:&nbsp;
                {salon['booking_lead_time_hours'] === 0
                  ? 'Same day'
                  : `${salon['booking_lead_time_hours']} ${salon['booking_lead_time_hours'] === 1 ? 'hour' : 'hours'}`}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {salon['full_description'] && (
          <div className="space-y-3">
            <span className="text-sm text-foreground">About</span>
            <p className="text-sm text-muted-foreground">{salon['full_description']}</p>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <span className="text-sm text-foreground">Contact</span>
          <ContactInfo
            phone={salon['primary_phone']}
            email={salon['primary_email']}
            websiteUrl={salon['website_url']}
          />
        </div>
      </CardContent>
    </Card>
  )
}
