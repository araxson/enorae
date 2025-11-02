'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Upload, User } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { uploadAvatar } from '@/features/shared/profile/api/mutations'
import { updateProfileMetadata } from '@/features/shared/profile-metadata/api/mutations'
import { profileUpdateSchema, avatarUploadSchema, type ProfileUpdateSchema } from '@/features/shared/profile/api/schema'
import type { Database } from '@/lib/types/database.types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile['avatar_url'])

  const form = useForm<ProfileUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profile['full_name'] || '',
    },
  })

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = avatarUploadSchema.safeParse({ file })
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid file')
      return
    }

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

  const handleSubmit = async (values: ProfileUpdateSchema) => {
    setError(null)

    // Update profile metadata with only the fields that exist in the database
    const result = await updateProfileMetadata({
      full_name: values.full_name || null,
    })

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Edit profile</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>Update your personal information and avatar</ItemDescription>
        <div className="space-y-6">
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
                accept="image/jpeg,image/png,image/webp"
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
                JPG, PNG, or WebP. Max 5MB.
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            id="full_name"
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FieldDescription>Displayed across your profile.</FieldDescription>
                        <FormMessage />
                      </FieldContent>
                    </Field>
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Update failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <ButtonGroup>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
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
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          </Form>
        </div>
      </ItemContent>
    </Item>
  )
}
