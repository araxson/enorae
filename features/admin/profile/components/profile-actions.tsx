'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldBan } from 'lucide-react'
import type { ProfileDetail } from '@/features/admin/profile/api/types'
import { anonymizeProfileAction, type ActionResponse } from '@/features/admin/profile/api/mutations'

interface ProfileActionsProps {
  profile: ProfileDetail | null
  onAnonymized: (profileId: string | null) => Promise<void> | void
  isLoading: boolean
}

const initialState: ActionResponse | null = null

export function ProfileActions({ profile, onAnonymized, isLoading }: ProfileActionsProps) {
  const [feedback, setFeedback] = useState<ActionResponse | null>(initialState)
  const [isPending, startTransition] = useTransition()

  if (!profile) {
    return null
  }

  const handleAnonymize = () => {
    if (!profile.summary.id) return

    const confirmed = window.confirm(
      'This will anonymize the selected user and remove identifying data. This action cannot be undone. Continue?',
    )

    if (!confirmed) {
      return
    }

    startTransition(async () => {
      setFeedback(initialState)
      const result = await anonymizeProfileAction(profile.summary.id)
      setFeedback(result)

      if (result.success) {
        await onAnonymized(profile.summary.id)
      }
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Security actions</CardTitle>
        <CardDescription>Administrative controls for user privacy and data retention.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Use anonymization to comply with GDPR and permanently redact personal data.
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending || isLoading}
          onClick={handleAnonymize}
        >
          <ShieldBan className="mr-2 h-4 w-4" />
          Anonymize user
        </Button>
      </CardContent>
      {feedback && (
        <CardContent className="pt-0">
          <Alert variant={feedback.success ? 'default' : 'destructive'}>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  )
}
