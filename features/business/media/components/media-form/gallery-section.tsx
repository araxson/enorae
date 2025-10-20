'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Stack, Grid } from '@/components/layout'
type GallerySectionProps = {
  galleryUrls: string[]
  newGalleryUrl: string
  isAddingImage: boolean
  onNewGalleryUrlChange: (value: string) => void
  onAddImage: () => void
  onRemoveImage: (url: string) => void
}

export function GallerySection({
  galleryUrls,
  newGalleryUrl,
  isAddingImage,
  onNewGalleryUrlChange,
  onAddImage,
  onRemoveImage,
}: GallerySectionProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap="md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Photo Gallery</h3>

          <div className="flex gap-2">
            <Input
              value={newGalleryUrl}
              onChange={(event) => onNewGalleryUrlChange(event.target.value)}
              placeholder="https://example.com/photo.jpg"
              type="url"
            />
            <Button type="button" onClick={onAddImage} disabled={isAddingImage || !newGalleryUrl.trim()}>
              Add
            </Button>
          </div>

          {galleryUrls.length > 0 ? (
            <Grid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
              {galleryUrls.map((url, index) => (
                <div key={index} className="group relative aspect-square">
                  <Image src={url} alt={`Gallery ${index + 1}`} fill className="rounded-lg object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onRemoveImage(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </Grid>
          ) : (
            <p className="text-sm text-muted-foreground">No gallery images yet. Add your first image above.</p>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
