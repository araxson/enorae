'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
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
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
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
            </div>
          ) : (
            <p className="text-muted-foreground">No gallery images yet. Add your first image above.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
