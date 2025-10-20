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
import { Separator } from '@/components/ui/separator'
import { Stack, Group } from '@/components/layout'
import { FavoriteButton } from '@/features/customer/favorites/components/favorite-button'
import { MapPin, Star } from 'lucide-react'
import {
  AmenitiesBadges,
  SpecialtiesTags,
  ContactInfo,
  SocialLinks,
  SalonStats,
} from '@/features/shared/customer-common/components'
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

        <Stack gap="lg" className="px-6 py-6">
          {/* Header with name and favorite button */}
          <div className="flex items-start justify-between gap-4">
            <Stack gap="sm" className="flex-1">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{salon.name}</h2>
              {salon.short_description && (
                <p className="leading-7 text-muted-foreground">{salon.short_description}</p>
              )}
            </Stack>
            {salon.id && (
              <FavoriteButton
                salonId={salon.id}
                initialFavorited={isFavorited}
                variant="default"
              />
            )}
          </div>

          {/* Rating and Location */}
          <Group gap="md">
            {salon.rating && (
              <Group gap="xs">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <small className="text-sm font-medium leading-none font-medium">{Number(salon.rating).toFixed(1)}</small>
                {salon.review_count && (
                  <small className="text-sm font-medium leading-none text-muted-foreground">
                    ({salon.review_count} {salon.review_count === 1 ? 'review' : 'reviews'})
                  </small>
                )}
              </Group>
            )}
            {salon.full_address && (
              <Group gap="xs">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <small className="text-sm font-medium leading-none text-muted-foreground">{salon.full_address}</small>
              </Group>
            )}
          </Group>

          <Separator />

          {/* Description */}
          {salon.description && (
            <Stack gap="sm">
              <p className="leading-7 font-medium">About</p>
              <p className="leading-7 text-muted-foreground">{salon.description}</p>
            </Stack>
          )}

          {/* Stats */}
          <SalonStats staffCount={salon.staff_count} servicesCount={salon.services_count} />

          {/* Specialties */}
          {salon.specialties && salon.specialties.length > 0 && (
            <Stack gap="sm">
              <p className="leading-7 font-medium">Specialties</p>
              <SpecialtiesTags specialties={salon.specialties} />
            </Stack>
          )}

          {/* Amenities */}
          {salon.amenities && salon.amenities.length > 0 && (
            <Stack gap="sm">
              <p className="leading-7 font-medium">Amenities</p>
              <AmenitiesBadges amenities={salon.amenities} />
            </Stack>
          )}

          <Separator />

          {/* Contact and Social */}
          <div className="grid gap-6 md:grid-cols-2">
            <Stack gap="sm">
              <p className="leading-7 font-medium">Contact</p>
              <ContactInfo
                phone={salon.phone}
                email={salon.email}
                websiteUrl={salon.website_url}
              />
            </Stack>
            {(salon.instagram_url || salon.facebook_url || salon.twitter_url || salon.tiktok_url) && (
              <Stack gap="sm">
                <p className="leading-7 font-medium">Social Media</p>
                <SocialLinks
                  instagramUrl={salon.instagram_url}
                  facebookUrl={salon.facebook_url}
                  twitterUrl={salon.twitter_url}
                  tiktokUrl={salon.tiktok_url}
                />
              </Stack>
            )}
          </div>
        </Stack>
      </CardContent>
      </Card>
    </div>
  )
}
