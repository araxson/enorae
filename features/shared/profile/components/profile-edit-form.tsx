'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { updateProfileMetadata } from '@/features/shared/profile-metadata/api/mutations'
import { profileUpdateSchema, type ProfileUpdateSchema } from '@/features/shared/profile/api/schema'
import type { Database } from '@/lib/types/database.types'
import { Form } from '@/components/ui/form'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ProfileAvatarUpload } from './profile-avatar-upload'
import { ProfileNameField } from './profile-name-field'
import { ProfileFormActions } from './profile-form-actions'

type Profile = Database['public']['Views']['profiles_view']['Row']

interface ProfileEditFormProps {
  profile: Profile
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProfileUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profile['full_name'] || '',
    },
  })

  const handleSubmit = async (values: ProfileUpdateSchema) => {
    setError(null)

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
          <ProfileAvatarUpload
            avatarUrl={profile['avatar_url']}
            onError={setError}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <ProfileNameField control={form.control} />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Update failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <ProfileFormActions isSubmitting={form.formState.isSubmitting} />
            </form>
          </Form>
        </div>
      </ItemContent>
    </Item>
  )
}
