'use client'

import { useCallback } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SessionWithDevice } from '@/features/customer/sessions/api/queries'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface SessionCardProps {
  session: SessionWithDevice
  onRevoke: (sessionId: string) => void
  isRevoking: boolean
}

export function SessionCard({ session, onRevoke, isRevoking }: SessionCardProps) {
  const handleRevoke = useCallback(() => {
    if (session['id']) {
      onRevoke(session['id'])
    }
  }, [session['id'], onRevoke])
  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActivityStatus = (lastActivity: string | null) => {
    if (!lastActivity) return 'Inactive'

    const now = new Date()
    const activityDate = new Date(lastActivity)
    const diffMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

    if (diffMinutes < 5) return 'Active now'
    if (diffMinutes < 60) return `Active ${diffMinutes} minutes ago`
    if (diffMinutes < 1440) return `Active ${Math.floor(diffMinutes / 60)} hours ago`
    return `Active ${Math.floor(diffMinutes / 1440)} days ago`
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="gap-3">
        <CardTitle>Session {session['id']?.substring(0, 8) || 'Unknown'}</CardTitle>
        <CardDescription>{getActivityStatus(session['updated_at'])}</CardDescription>
        <div className="flex flex-wrap items-center gap-2">
          {session.is_current ? <Badge variant="default">Current Session</Badge> : null}
          {session['is_suspicious'] ? <Badge variant="destructive">Suspicious</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Created</ItemTitle>
              <ItemDescription className="text-foreground">
                {formatDate(session['created_at'])}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Last updated</ItemTitle>
              <ItemDescription className="text-foreground">
                {formatDate(session['updated_at'])}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Status</ItemTitle>
              <ItemDescription className="text-foreground">
                {session['is_active'] ? 'Active' : 'Inactive'}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
      {!session.is_current && session['id'] ? (
        <CardFooter className="justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRevoke}
            disabled={isRevoking}
          >
            {isRevoking ? 'Revoking...' : 'Revoke'}
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}
