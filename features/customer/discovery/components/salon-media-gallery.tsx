'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
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
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            <CardTitle>Gallery</CardTitle>
          </div>
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
              <p className="mb-2 text-xs text-muted-foreground">Logo</p>
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
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
              <p className="mb-2 text-xs text-muted-foreground">Cover image</p>
              <div className="relative w-full overflow-hidden rounded-lg border">
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
              <p className="mb-2 text-xs text-muted-foreground">Photos</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            <div className="py-8 text-center">
              <ImageIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No photos available yet</p>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
