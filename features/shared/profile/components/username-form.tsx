'use client'

import { useActionState, useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateUsername } from '@/features/shared/profile/api/mutations'
import { toast } from '@/components/ui/sonner'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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

interface UsernameFormProps {
  currentUsername: string | null
}

interface FormState {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
  data?: unknown
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button type="submit" disabled={disabled}>
      <span>Update Username</span>
    </Button>
  )
}

export function UsernameForm({ currentUsername }: UsernameFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await updateUsername(formData)
      return result as FormState
    },
    {}
  )

  // Show toast notifications based on state
  useEffect(() => {
    if (state.success) {
      toast.success('Username updated successfully')
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Username</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          Your unique username is used to identify you across the platform
        </ItemDescription>
        <form action={formAction} aria-describedby={state.error ? 'form-error' : undefined}>
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Form is submitting, please wait'}
          </div>

          {/* Error summary */}
          {state.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription id="form-error">
                {state.error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-6">
            <Field data-invalid={state.fieldErrors?.['username'] ? true : undefined}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <FieldContent>
                <Input
                  id="username"
                  name="username"
                  defaultValue={currentUsername || ''}
                  placeholder="e.g., john_doe"
                  minLength={3}
                  maxLength={50}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Username can only contain letters, numbers, hyphens, and underscores"
                  required
                  aria-required="true"
                  aria-invalid={state.fieldErrors?.['username'] ? true : false}
                  aria-describedby={
                    state.fieldErrors?.['username'] ? 'username-error username-hint' : 'username-hint'
                  }
                  disabled={isPending}
                />
                <FieldDescription id="username-hint">
                  3-50 characters. Letters, numbers, hyphens, and underscores only.
                </FieldDescription>
                <FieldError
                  id="username-error"
                  errors={state.fieldErrors?.['username']?.map((message) => ({ message }))}
                />
              </FieldContent>
            </Field>

            <div className="flex justify-end">
              <SubmitButton disabled={isPending} />
            </div>
          </div>
        </form>
      </ItemContent>
    </Item>
  )
}
