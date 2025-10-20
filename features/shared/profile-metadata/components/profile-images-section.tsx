'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Upload, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Stack, Flex } from '@/components/layout'
type ProfileImagesSectionProps = {
  avatarUrl: string
  coverUrl: string
  isUploadingAvatar: boolean
  isUploadingCover: boolean
  onAvatarUpload: (file: File | null) => void
  onCoverUpload: (file: File | null) => void
}

export function ProfileImagesSection({
  avatarUrl,
  coverUrl,
  isUploadingAvatar,
  isUploadingCover,
  onAvatarUpload,
  onCoverUpload,
}: ProfileImagesSectionProps) {
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <Label>Avatar</Label>
        <Flex gap="lg" align="center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <Stack gap="sm">
            <Input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => onAvatarUpload(event.target.files?.[0] ?? null)}
              disabled={isUploadingAvatar}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
            </Button>
            <p className="text-sm text-muted-foreground">Max 5MB, JPG or PNG</p>
          </Stack>
        </Flex>
      </Stack>

      <Stack gap="sm">
        <Label>Cover Image</Label>
        {coverUrl && (
          <div className="w-full h-48 rounded-lg overflow-hidden bg-muted relative">
            <Image src={coverUrl} alt="Cover" fill className="object-cover" />
          </div>
        )}
        <Stack gap="sm">
          <Input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => onCoverUpload(event.target.files?.[0] ?? null)}
            disabled={isUploadingCover}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploadingCover ? 'Uploading...' : 'Upload Cover Image'}
          </Button>
          <p className="text-sm text-muted-foreground">Max 10MB, JPG or PNG, recommended 1200x400px</p>
        </Stack>
      </Stack>
    </Stack>
  )
}
