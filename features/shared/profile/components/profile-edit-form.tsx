'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Upload, User } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { uploadAvatar } from '@/features/shared/profile/api/mutations'
import { updateProfileMetadata } from '@/features/shared/profile-metadata/api/mutations'
import type { Database } from '@/lib/types/database.types'
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
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type Profile = Database['public']['Views']['profiles_view']['Row']

interface ProfileEditFormProps {
  profile: Profile
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile['avatar_url'])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload avatar
    setIsUploadingAvatar(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
      setAvatarPreview(profile['avatar_url']) // Reset preview on error
    }

    setIsUploadingAvatar(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Update profile metadata with only the fields that exist in the database
    const result = await updateProfileMetadata({
      full_name: formData.get('full_name') as string || null,
    })

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Edit profile</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>Update your personal information and avatar</ItemDescription>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
          <div className="size-24">
            <Avatar>
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback>
                <User className="size-12" />
              </AvatarFallback>
            </Avatar>
          </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
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
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP or GIF. Max 5MB.
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="full_name">Full name</FieldLabel>
              <FieldContent>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile['full_name'] || ''}
                  placeholder="Enter your full name"
                />
                <FieldDescription>Displayed across your profile.</FieldDescription>
              </FieldContent>
            </Field>
          </div>

          {error && (
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ButtonGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.refresh()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </ItemContent>
    </Item>
  )
}
