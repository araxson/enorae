'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Upload, User } from 'lucide-react'
import { uploadAvatar } from '@/features/shared/profile/api/mutations'
import { avatarUploadSchema } from '@/features/shared/profile/api/schema'

interface ProfileAvatarUploadProps {
  avatarUrl: string | null
  onError: (error: string) => void
}

export function ProfileAvatarUpload({ avatarUrl, onError }: ProfileAvatarUploadProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(avatarUrl)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = avatarUploadSchema.safeParse({ file })
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      onError(firstError || 'Invalid file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

    if (result.success) {
      router.refresh()
    } else {
      onError(result.error)
      setPreview(avatarUrl)
    }

    setIsUploading(false)
  }

  return (
    <div className="flex items-center gap-6">
      <div className="size-24">
        <Avatar>
          <AvatarImage src={preview || undefined} />
          <AvatarFallback>
            <User className="size-12" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Spinner />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="size-4" />
              <span>Upload avatar</span>
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">JPG, PNG, or WebP. Max 5MB.</p>
      </div>
    </div>
  )
}
