'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { AspectRatio } from '@/components/ui/aspect-ratio'
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
        <FieldSet className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="gallery-url-input">Gallery image URL</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  id="gallery-url-input"
                  value={newGalleryUrl}
                  onChange={(event) => onNewGalleryUrlChange(event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  type="url"
                  aria-label="Gallery image URL"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    onClick={onAddImage}
                    disabled={isAddingImage || !newGalleryUrl.trim()}
                    aria-label="Add gallery image"
                  >
                    Add
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </FieldContent>
          </Field>

          {galleryUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {galleryUrls.map((url, index) => (
                <AspectRatio key={index} ratio={1} className="group overflow-hidden rounded-lg">
                  <div className="relative h-full w-full">
                    <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => onRemoveImage(url)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </AspectRatio>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No gallery images yet</EmptyTitle>
                <EmptyDescription>Add your first image using the field above.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </FieldSet>
      </CardContent>
    </Card>
  )
}
