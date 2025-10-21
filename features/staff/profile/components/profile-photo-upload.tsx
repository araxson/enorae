'use client'
import { useState } from 'react'
import { Camera, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { uploadPortfolioImage } from '../api/mutations'

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null
  userName?: string
}

export function ProfilePhotoUpload({ currentPhotoUrl, userName }: ProfilePhotoUploadProps) {
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
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setIsUploading(false)
    }
  }

  const initials = userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '??'

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <h3 className="scroll-m-20 text-2xl font-semibold">Profile Photo</h3>

        <div className="flex gap-6 items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentPhotoUrl || undefined} alt={userName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-3 flex-1">
            <div>
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
              <label htmlFor="photo-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
              </label>
            </div>

            <p className="text-sm text-muted-foreground text-xs">
              Supported formats: JPEG, PNG, WebP (Max 5MB)
            </p>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
