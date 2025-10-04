'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
import { H4, P, Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'

interface MessageThread {
  id: string
  salon_id: string
  subject: string | null
  status: string
  priority: string
  updated_at: string
  unread_count_customer?: number
  unread_count_staff?: number
}

interface ThreadListProps {
  threads: MessageThread[]
  basePath?: string
  currentUserRole?: 'customer' | 'staff'
}

export function ThreadList({ threads, basePath = '/messages', currentUserRole = 'customer' }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box py="lg" className="text-center">
            <P className="text-muted-foreground">No messages yet</P>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive'
      case 'high':
        return 'default'
      case 'normal':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getUnreadCount = (thread: MessageThread) => {
    return currentUserRole === 'customer'
      ? thread.unread_count_customer || 0
      : thread.unread_count_staff || 0
  }

  return (
    <Stack gap="sm">
      {threads.map((thread) => {
        const unreadCount = getUnreadCount(thread)

        return (
          <Link key={thread.id} href={`${basePath}/${thread.id}`} className="block hover:opacity-90 transition-opacity">
            <Card className={unreadCount > 0 ? 'border-primary' : ''}>
              <CardContent>
                <Box p="md">
                  <Stack gap="xs">
                    <Flex align="start" justify="between">
                      <Flex gap="sm" align="center">
                        <H4 className="mb-0">
                          {thread.subject || 'No subject'}
                        </H4>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="h-6 min-w-6 rounded-full flex items-center justify-center">
                            {unreadCount}
                          </Badge>
                        )}
                      </Flex>
                      <Flex gap="sm">
                        <Badge variant={getPriorityVariant(thread.priority)}>
                          {thread.priority}
                        </Badge>
                        <Badge variant={thread.status === 'active' ? 'default' : 'secondary'}>
                          {thread.status}
                        </Badge>
                      </Flex>
                    </Flex>
                    <Small className="text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true })}
                    </Small>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </Stack>
  )
}
