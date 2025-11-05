'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { updateProfileAction } from '@/features/shared/profile/api/actions'
import type { Database } from '@/lib/types/database.types'
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

const initialState: { message?: string; errors?: Record<string, string[]>; success?: boolean } = {}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)
  const firstErrorRef = useRef<HTMLInputElement | null>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Edit profile</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>Update your personal information and avatar</ItemDescription>

        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending && 'Form is submitting, please wait'}
          {state?.message && !isPending && state.message}
        </div>

        <div className="space-y-6 mt-6">
          <ProfileAvatarUpload
            avatarUrl={profile['avatar_url']}
            onError={(error) => {
              // Avatar upload errors are handled by the component itself
              console.error('Avatar upload error:', error)
            }}
          />

          {/* Error summary for screen readers and accessibility */}
          {hasErrors && state.errors && (
            <Alert variant="destructive" tabIndex={-1}>
              <AlertCircle className="size-4" />
              <AlertTitle>
                There are {Object.keys(state.errors).length} errors in the form
              </AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {Object.entries(state.errors).map(([field, messages]) => (
                    <li key={field}>
                      <a
                        href={`#${field}`}
                        className="underline hover:no-underline"
                      >
                        {field.replace(/_/g, ' ')}: {(messages as string[])[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {state?.success && (
            <Alert aria-live="polite">
              <CheckCircle className="size-4" />
              <AlertTitle>Profile updated</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* General error message (not field-specific) */}
          {state?.message && !state.success && !hasErrors && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <form
            action={formAction}
            className="space-y-4"
            aria-describedby={hasErrors ? 'form-errors' : undefined}
          >
            <ProfileNameField
              defaultValue={profile['full_name'] || ''}
              error={state?.errors?.['full_name']?.[0]}
              disabled={isPending}
              firstErrorRef={state?.errors?.['full_name'] ? firstErrorRef : undefined}
            />

            <ProfileFormActions isPending={isPending} />
          </form>
        </div>
      </ItemContent>
    </Item>
  )
}
