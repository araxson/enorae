'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
      <div className="flex flex-col gap-3">
        <Label htmlFor="portfolio-upload">Upload Image</Label>
        <Input
          id="portfolio-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>

      <div className="text-center text-sm text-muted-foreground">or</div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="image-url">Image URL</Label>
        <Input
          id="image-url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="image-caption">Caption (Optional)</Label>
        <Input
          id="image-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Describe this image..."
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddImage}
        disabled={!imageUrl.trim()}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        Add to Portfolio
      </Button>

      {images.length > 0 && (
        <div>
          <div className="mb-4">
            <Badge variant="secondary">
              {images.length} image{images.length !== 1 ? 's' : ''} in portfolio
            </Badge>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.caption || 'Portfolio image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {image.caption && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {image.caption}
                  </p>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
