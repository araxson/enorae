'use client'

import { useId, useRef } from 'react'
import Image from 'next/image'
import { Upload, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
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
  const avatarInputId = useId()
  const coverInputId = useId()

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor={avatarInputId}>Avatar</FieldLabel>
        <FieldContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-6">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  <User className="size-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-3">
                <input
                  id={avatarInputId}
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
                  {isUploadingAvatar ? (
                    <>
                      <Spinner />
                      Uploading
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      Upload Avatar
                    </>
                  )}
                </Button>
                <FieldDescription>Max 5MB, JPG or PNG</FieldDescription>
              </div>
            </div>
          </div>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor={coverInputId}>Cover Image</FieldLabel>
        <FieldContent>
          <div className="flex flex-col gap-3">
            {coverUrl ? (
              <AspectRatio ratio={3}>
                <Image src={coverUrl} alt="Cover" fill className="rounded-lg object-cover" />
              </AspectRatio>
            ) : null}
            <input
              id={coverInputId}
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
              {isUploadingCover ? (
                <>
                  <Spinner />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Upload Cover Image
                </>
              )}
            </Button>
            <FieldDescription>
              Max 10MB, JPG or PNG, recommended 1200x400px
            </FieldDescription>
          </div>
        </FieldContent>
      </Field>
    </div>
  )
}
