'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { updateProfile } from '@/features/business/settings-account/api/mutations'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles_view']['Row']

interface AccountInfoFormProps {
  profile: Profile
}

export function AccountInfoForm({ profile }: AccountInfoFormProps) {
  const [fullName, setFullName] = useState(profile['full_name'] || '')
  const [phone, setPhone] = useState(profile['phone'] || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile({
        full_name: fullName,
        phone,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Account Information</ItemTitle>
        <ItemDescription>Update your personal information</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup className="gap-6">
              {success && (
                <Alert>
                  <CheckCircle className="size-4" />
                <AlertTitle>Profile updated</AlertTitle>
                <AlertDescription>Profile updated successfully</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    value={profile['email'] || ''}
                    disabled
                    className="bg-muted"
                  />
                  <FieldDescription>
                    Email cannot be changed here. Contact support if needed.
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <FieldContent>
                  <Input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <FieldContent>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    disabled={isSubmitting}
                  />
                </FieldContent>
              </Field>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </ItemContent>
    </Item>
  )
}
