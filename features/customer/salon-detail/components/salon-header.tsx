'use client'

import Image from 'next/image'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
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

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Header with name and favorite button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1">
              <h1>{salon.name}</h1>
              {salon.short_description && (
                <CardDescription>{salon.short_description}</CardDescription>
              )}
            </div>
            {salon.id && (
              <FavoriteButton
                salonId={salon.id}
                initialFavorited={isFavorited}
                variant="default"
              />
            )}
          </div>

          {/* Rating and Location */}
          <div className="flex gap-4 items-center">
            {salon.rating && (
              <div className="flex gap-2 items-center">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <CardDescription>{Number(salon.rating).toFixed(1)}</CardDescription>
                {salon.review_count && (
                  <CardDescription>
                    ({salon.review_count} {salon.review_count === 1 ? 'review' : 'reviews'})
                  </CardDescription>
                )}
              </div>
            )}
            {salon.full_address && (
              <div className="flex gap-2 items-center">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <CardDescription>{salon.full_address}</CardDescription>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          {salon.description && (
            <div className="flex flex-col gap-3">
              <h3>About</h3>
              <CardDescription>{salon.description}</CardDescription>
            </div>
          )}

          {/* Stats */}
          <SalonStats staffCount={salon.staff_count} servicesCount={salon.services_count} />

          {/* Specialties */}
          {salon.specialties && salon.specialties.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3>Specialties</h3>
              <SpecialtiesTags specialties={salon.specialties} />
            </div>
          )}

          {/* Amenities */}
          {salon.amenities && salon.amenities.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3>Amenities</h3>
              <AmenitiesBadges amenities={salon.amenities} />
            </div>
          )}

          <Separator />

          {/* Contact and Social */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h3>Contact</h3>
              <ContactInfo
                phone={salon.phone}
                email={salon.email}
                websiteUrl={salon.website_url}
              />
            </div>
            {(salon.instagram_url || salon.facebook_url || salon.twitter_url || salon.tiktok_url) && (
              <div className="flex flex-col gap-3">
                <h3>Social Media</h3>
                <SocialLinks
                  instagramUrl={salon.instagram_url}
                  facebookUrl={salon.facebook_url}
                  twitterUrl={salon.twitter_url}
                  tiktokUrl={salon.tiktok_url}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
