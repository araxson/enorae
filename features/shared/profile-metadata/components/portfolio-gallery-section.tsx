'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemContent,
} from '@/components/ui/item'

type PortfolioImage = {
  url: string
  caption?: string
}

type Props = {
  images: PortfolioImage[]
  onAdd: (image: PortfolioImage) => void
  onRemove: (index: number) => void
}

export function PortfolioGallerySection({ images, onAdd, onRemove }: Props) {
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleAddImage = () => {
    if (!imageUrl.trim()) return

    onAdd({
      url: imageUrl.trim(),
      caption: caption.trim() || undefined,
    })

    setImageUrl('')
    setCaption('')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create FormData to upload
    const formData = new FormData()
    formData.append('file', file)

    try {
      // In a real implementation, this would upload to Supabase storage
      // For now, we'll create a local URL
      const localUrl = URL.createObjectURL(file)
      onAdd({ url: localUrl })
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="portfolio-upload">Upload Image</FieldLabel>
        <FieldContent>
          <Input
            id="portfolio-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <FieldDescription>
            Supports JPG, PNG, GIF, and WebP formats.
          </FieldDescription>
        </FieldContent>
      </Field>

      <div className="text-center text-sm text-muted-foreground">or</div>

      <Field>
        <FieldLabel htmlFor="image-url">Image URL</FieldLabel>
        <FieldContent>
          <Input
            id="image-url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="image-caption">Caption (Optional)</FieldLabel>
        <FieldContent>
          <Input
            id="image-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe this image..."
          />
        </FieldContent>
      </Field>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddImage}
        disabled={!imageUrl.trim()}
        className="w-full"
      >
        <Upload className="mr-2 size-4" />
        Add to Portfolio
      </Button>

      {images.length > 0 && (
        <Item variant="outline" className="space-y-4">
          <ItemContent>
            <div>
              <Badge variant="secondary">
                {images.length} image{images.length !== 1 ? 's' : ''} in portfolio
              </Badge>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <AspectRatio ratio={1}>
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.caption || 'Portfolio image'}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-md border bg-muted">
                        <ImageIcon className="size-8 text-muted-foreground" />
                      </div>
                    )}
                  </AspectRatio>
                  {image.caption && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {image.caption}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onRemove(index)}
                    aria-label={`Remove ${image.caption || 'image'}`}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ItemContent>
        </Item>
      )}
    </div>
  )
}
