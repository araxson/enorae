'use client'
import { useState } from 'react'
import { Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Stack, Grid } from '@/components/layout'
import { uploadPortfolioImage } from '../api/mutations'
import Image from 'next/image'

interface PortfolioGalleryProps {
  portfolioImages?: string[]
}

export function PortfolioGallery({ portfolioImages = [] }: PortfolioGalleryProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('image', file)

      const result = await uploadPortfolioImage(formData)

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-6">
      <Stack gap="md">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Portfolio Gallery</h3>

        <div>
          <input
            type="file"
            id="portfolio-upload"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="portfolio-upload">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById('portfolio-upload')?.click()}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </>
              )}
            </Button>
          </label>
          <p className="text-sm text-muted-foreground text-xs ml-2">
            Max 5MB per image
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {portfolioImages.length > 0 ? (
          <Grid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
            {portfolioImages.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Portfolio image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </Grid>
        ) : (
          <Card className="p-8 text-center border-dashed">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No portfolio images yet. Add your best work!</p>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
