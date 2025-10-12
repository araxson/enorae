'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Database } from '@/lib/types/database.types'

type SalonMediaView = Database['public']['Views']['salon_media_view']['Row']

interface SalonMediaGalleryProps {
  media: SalonMediaView
}

export function SalonMediaGallery({ media }: SalonMediaGalleryProps) {
  const galleryUrls = (media.gallery_urls as string[]) || []
  const hasGallery = galleryUrls.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Gallery
          </CardTitle>
          {media.gallery_image_count !== null && media.gallery_image_count > 0 && (
            <Badge variant="secondary">{media.gallery_image_count} photos</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {/* Logo */}
          {media.logo_url && (
            <div>
              <Muted className="mb-2 block text-xs">Logo</Muted>
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <Image
                  src={media.logo_url}
                  alt={media.salon_name || 'Salon logo'}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Cover Image */}
          {media.cover_image_url && (
            <div>
              <Muted className="mb-2 block text-xs">Cover Image</Muted>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={media.cover_image_url}
                  alt={media.salon_name || 'Salon cover'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {hasGallery && (
            <div>
              <Muted className="mb-2 block text-xs">Photos</Muted>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  >
                    <Image
                      src={url}
                      alt={`${media.salon_name || 'Salon'} - Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Media Message */}
          {!media.logo_url && !media.cover_image_url && !hasGallery && (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <Muted>No photos available yet</Muted>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
