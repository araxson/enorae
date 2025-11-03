'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldBan } from 'lucide-react'
import type { ProfileDetail } from '@/features/admin/profile/api/types'
import { anonymizeProfileAction, type ActionResponse } from '@/features/admin/profile/api/mutations'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

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
      <CardHeader>
        <div className="pb-2">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Security actions</CardTitle>
              <CardDescription>Administrative controls for user privacy and data retention.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Item variant="muted" className="flex-1">
            <ItemContent>
              <p className="text-sm text-muted-foreground">
                Use anonymization to comply with GDPR and permanently redact personal data.
              </p>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemActions>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending || isLoading}
                  onClick={handleAnonymize}
                >
                  {isPending || isLoading ? (
                    <Spinner className="mr-2" />
                  ) : (
                    <ShieldBan className="mr-2 size-4" />
                  )}
                  {isPending || isLoading ? 'Anonymizing…' : 'Anonymize user'}
                </Button>
              </ButtonGroup>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
      {feedback && (
        <CardContent>
          <div className="pt-0">
            <Alert variant={feedback.success ? 'default' : 'destructive'}>
              <AlertTitle>{feedback.success ? 'Action completed' : 'Action failed'}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
