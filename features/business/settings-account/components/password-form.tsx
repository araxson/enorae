'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { updatePassword } from '@/features/business/settings-account/api/mutations'

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    // Validation
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      setIsSubmitting(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      await updatePassword(currentPassword, newPassword)
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Change Password</ItemTitle>
        <ItemDescription>Update your password to keep your account secure</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup className="gap-6">
              {success && (
                <Alert>
                  <CheckCircle className="size-4" />
                <AlertTitle>Password updated</AlertTitle>
                <AlertDescription>Password updated successfully</AlertDescription>
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
                <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                <FieldContent>
                  <InputGroup data-disabled={isSubmitting}>
                    <InputGroupInput
                      id="current-password"
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() => setShowCurrent(!showCurrent)}
                        disabled={isSubmitting}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                      >
                        {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <FieldContent>
                  <InputGroup data-disabled={isSubmitting}>
                    <InputGroupInput
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() => setShowNew(!showNew)}
                        disabled={isSubmitting}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={showNew ? 'Hide new password' : 'Show new password'}
                      >
                        {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Must be at least 8 characters</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
                <FieldContent>
                  <InputGroup data-disabled={isSubmitting}>
                    <InputGroupInput
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        disabled={isSubmitting}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </FieldContent>
              </Field>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </ItemContent>
    </Item>
  )
}
