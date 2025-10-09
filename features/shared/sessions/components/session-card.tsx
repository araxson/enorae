import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { P, Muted, Small } from '@/components/ui/typography'
import type { SessionWithDevice } from '../api/queries'

interface SessionCardProps {
  session: SessionWithDevice
  onRevoke: (sessionId: string) => void
  isRevoking: boolean
}

export function SessionCard({ session, onRevoke, isRevoking }: SessionCardProps) {
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
    <Card>
      <CardContent className="space-y-4">
        <Stack gap="md">
          <Flex justify="between" align="start">
            <Stack gap="xs">
              <Flex gap="sm" align="center">
                <P className="font-medium">Session {session.id?.substring(0, 8) || 'Unknown'}</P>
                {session.is_current && (
                  <Badge variant="default">Current Session</Badge>
                )}
                {session.is_suspicious && (
                  <Badge variant="destructive">Suspicious</Badge>
                )}
              </Flex>
              <Muted>{getActivityStatus(session.updated_at)}</Muted>
            </Stack>

            {!session.is_current && session.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRevoke(session.id!)}
                disabled={isRevoking}
              >
                {isRevoking ? 'Revoking...' : 'Revoke'}
              </Button>
            )}
          </Flex>

          <Stack gap="xs">
            <Flex gap="sm">
              <Small className="w-24 text-muted-foreground">Created:</Small>
              <Small>{formatDate(session.created_at)}</Small>
            </Flex>

            <Flex gap="sm">
              <Small className="w-24 text-muted-foreground">Last Updated:</Small>
              <Small>{formatDate(session.updated_at)}</Small>
            </Flex>

            <Flex gap="sm">
              <Small className="w-24 text-muted-foreground">Status:</Small>
              <Small>{session.is_active ? 'Active' : 'Inactive'}</Small>
            </Flex>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
