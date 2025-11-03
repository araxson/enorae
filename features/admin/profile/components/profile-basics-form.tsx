'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import type { ProfileDetail } from '@/features/admin/profile/api/types'
import { updateProfileBasicsAction, type ActionResponse } from '@/features/admin/profile/api/mutations'

interface ProfileBasicsFormProps {
  profile: ProfileDetail | null
  onUpdated: () => Promise<void>
}

const initialState: ActionResponse | null = null

export function ProfileBasicsForm({ profile, onUpdated }: ProfileBasicsFormProps) {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [feedback, setFeedback] = useState<ActionResponse | null>(initialState)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!profile) return
    setFullName(profile.metadata.fullName ?? profile.summary.fullName ?? '')
    setUsername(profile.summary.username ?? '')
    setFeedback(initialState)
  }, [profile])

  if (!profile) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(initialState)

    startTransition(async () => {
      const payload = {
        profileId: profile.summary.id,
        fullName: fullName.trim(),
        username: username.trim(),
      }

      const result = await updateProfileBasicsAction(payload)
      setFeedback(result)

      if (result.success) {
        await onUpdated()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="pb-2">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Profile details</CardTitle>
              <CardDescription>Update core profile identifiers for this user.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="admin-profile-full-name">Full name</FieldLabel>
              <FieldContent>
                <Input
                  id="admin-profile-full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Alex Johnson"
                  disabled={isPending}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="admin-profile-username">Username</FieldLabel>
              <FieldContent>
                <Input
                  id="admin-profile-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="alex.j"
                  disabled={isPending}
                />
                <FieldDescription>
                  Letters, numbers, and . _ - characters are allowed (3-32 characters).
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>

          {feedback && (
            <Alert variant={feedback.success ? 'default' : 'destructive'}>
              <AlertTitle>{feedback.success ? 'Profile updated' : 'Update failed'}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <ItemGroup>
            <Item variant="muted">
              <ItemActions>
                <ButtonGroup>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Spinner className="mr-2" />
                        Saving…
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFullName(profile.metadata.fullName ?? profile.summary.fullName ?? '')
                      setUsername(profile.summary.username ?? '')
                      setFeedback(initialState)
                    }}
                    disabled={isPending}
                  >
                    Reset
                  </Button>
                </ButtonGroup>
              </ItemActions>
            </Item>
          </ItemGroup>
        </form>
      </CardContent>
    </Card>
  )
}
