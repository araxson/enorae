'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ProfileDetail } from '@/features/admin/profile/types'
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
      <CardHeader className="pb-2">
        <CardTitle>Profile details</CardTitle>
        <CardDescription>Update core profile identifiers for this user.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-profile-full-name" className="text-sm font-medium">
              Full name
            </label>
            <Input
              id="admin-profile-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Alex Johnson"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-profile-username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="admin-profile-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="alex.j"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Letters, numbers, and . _ - characters are allowed (3-32 characters).
            </p>
          </div>

          {feedback && (
            <Alert variant={feedback.success ? 'default' : 'destructive'}>
              <AlertTitle>{feedback.success ? 'Profile updated' : 'Update failed'}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save changes'}
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
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
