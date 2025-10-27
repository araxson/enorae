'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Database } from '@/lib/types/database.types'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type SalonMediaView = Database['public']['Views']['salon_media_view']['Row']

interface SalonMediaGalleryProps {
  media: SalonMediaView
}

export function SalonMediaGallery({ media }: SalonMediaGalleryProps) {
  const galleryUrls = (media['gallery_urls'] as string[]) || []
  const hasGallery = galleryUrls.length > 0

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <ImageIcon className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Gallery</ItemTitle>
            </ItemContent>
            {media['gallery_image_count'] !== null && media['gallery_image_count'] > 0 ? (
              <ItemActions className="flex-none">
                <Badge variant="secondary">{media['gallery_image_count']} photos</Badge>
              </ItemActions>
            ) : null}
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {media['logo_url'] || media['cover_image_url'] || hasGallery ? (
          <ItemGroup className="gap-4">
            {media['logo_url'] && (
              <Item>
                <ItemContent className="gap-2">
                  <ItemTitle>Logo</ItemTitle>
                  <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                    <Image
                      src={media['logo_url']}
                      alt={media['salon_name'] || 'Salon logo'}
                      fill
                      className="object-contain"
                    />
                  </AspectRatio>
                </ItemContent>
              </Item>
            )}

            {media['cover_image_url'] && (
              <Item>
                <ItemContent className="gap-2">
                  <ItemTitle>Cover image</ItemTitle>
                  <AspectRatio ratio={21 / 9} className="overflow-hidden rounded-md">
                    <Image
                      src={media['cover_image_url']}
                      alt={media['salon_name'] || 'Salon cover'}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </ItemContent>
              </Item>
            )}

            {hasGallery && (
              <Item>
                <ItemContent className="gap-2">
                  <ItemTitle>Photos</ItemTitle>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {galleryUrls.map((url, idx) => (
                        <CarouselItem key={idx} className="basis-1/2 md:basis-1/3">
                          <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                            <Image
                              src={url}
                              alt={`${media['salon_name'] || 'Salon'} - Photo ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </AspectRatio>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </ItemContent>
              </Item>
            )}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyMedia variant="icon">
              <ImageIcon className="h-6 w-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No photos available</EmptyTitle>
              <EmptyDescription>Upload media to showcase your salon.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
