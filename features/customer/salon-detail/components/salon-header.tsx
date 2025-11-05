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
import { FavoriteButton } from '@/features/customer/favorites/components'
import { Clock, MapPin, Star } from 'lucide-react'
import {
  ContactInfo,
} from '@/features/shared/customer-common/components'
import type { Database } from '@/lib/types/database.types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
  const galleryUrls = media?.gallery_urls && Array.isArray(media.gallery_urls) ? media.gallery_urls : []
  const coverImage = media?.cover_image_url

  const images = galleryUrls.length > 0
    ? galleryUrls.map((url, index) => ({
        url: url || '',
        alt: `${salon.name} - Image ${index + 1}`,
      })).filter(img => img.url)
    : coverImage
    ? [{ url: coverImage, alt: `${salon.name} cover image` }]
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
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : images.length > 0 ? (
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
              <Image
                src={images[0]?.url ?? ''}
                alt={images[0]?.alt ?? ''}
                fill
                className="object-cover"
                loading="eager"
                priority
              />
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardHeader>
        <ItemGroup className="gap-4">
          <Item className="flex-1" variant="muted">
            <ItemContent>
              <CardTitle>{salon.name}</CardTitle>
              {salon.short_description ? (
                <CardDescription>{salon.short_description}</CardDescription>
              ) : null}
            </ItemContent>
          </Item>
          {salon.id ? (
            <Item>
              <ItemActions className="flex-none">
                <FavoriteButton
                  salonId={salon.id}
                  initialFavorited={isFavorited}
                  variant="default"
                />
              </ItemActions>
            </Item>
          ) : null}
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <ItemGroup className="flex flex-wrap gap-4">
          {salon['rating_average'] ? (
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Star className="size-4 fill-accent text-accent" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{Number(salon['rating_average']).toFixed(1)}</ItemTitle>
                {salon['rating_count'] ? (
                  <ItemDescription>
                    ({salon['rating_count']}{' '}
                    {salon['rating_count'] === 1 ? 'review' : 'reviews'})
                  </ItemDescription>
                ) : null}
              </ItemContent>
            </Item>
          ) : null}

          {salon['formatted_address'] ? (
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <MapPin className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>
                  <span className="text-sm text-foreground">
                    {salon['formatted_address']}
                  </span>
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {typeof salon['booking_lead_time_hours'] === 'number' ? (
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Clock className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>
                  Booking lead time:&nbsp;
                  {salon['booking_lead_time_hours'] === 0
                    ? 'Same day'
                    : `${salon['booking_lead_time_hours']} ${
                        salon['booking_lead_time_hours'] === 1 ? 'hour' : 'hours'
                      }`}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>

        <Separator />

        {salon['full_description'] && (
          <div className="space-y-3">
            <span className="text-sm text-foreground">About</span>
            <CardDescription>{salon['full_description']}</CardDescription>
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
