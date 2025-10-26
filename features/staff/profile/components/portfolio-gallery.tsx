'use client'
import { useState } from 'react'
import { Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { uploadPortfolioImage } from '@/features/staff/profile/api/mutations'
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
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Gallery</CardTitle>
        <CardDescription>Upload images to showcase your work.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
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
            <p className="ml-2 text-xs text-muted-foreground">Max 5MB per image</p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {portfolioImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {portfolioImages.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Portfolio image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <Alert className="flex flex-col items-center gap-3 py-6">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <AlertTitle>No portfolio images yet</AlertTitle>
              <AlertDescription>Add your best work!</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
