'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Database } from '@/lib/types/database.types'
import { AspectRatio } from '@/components/ui/aspect-ratio'

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            <CardTitle>Gallery</CardTitle>
          </div>
          {media['gallery_image_count'] !== null && media['gallery_image_count'] > 0 && (
            <Badge variant="secondary">{media['gallery_image_count']} photos</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Logo */}
          {media['logo_url'] && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Logo</p>
              <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                <Image
                  src={media['logo_url']}
                  alt={media['salon_name'] || 'Salon logo'}
                  fill
                  className="object-contain"
                />
              </AspectRatio>
            </div>
          )}

          {/* Cover Image */}
          {media['cover_image_url'] && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Cover image</p>
              <AspectRatio ratio={21 / 9} className="overflow-hidden rounded-md">
                <Image
                  src={media['cover_image_url']}
                  alt={media['salon_name'] || 'Salon cover'}
                  fill
                  className="object-cover"
                />
              </AspectRatio>
            </div>
          )}

          {/* Gallery Grid */}
          {hasGallery && (
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Photos</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryUrls.map((url, idx) => (
                  <AspectRatio key={idx} ratio={1} className="overflow-hidden rounded-md">
                    <Image
                      src={url}
                      alt={`${media['salon_name'] || 'Salon'} - Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                ))}
              </div>
            </div>
          )}

          {/* No Media Message */}
          {!media['logo_url'] && !media['cover_image_url'] && !hasGallery && (
            <div className="py-8 text-center">
              <ImageIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No photos available yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
