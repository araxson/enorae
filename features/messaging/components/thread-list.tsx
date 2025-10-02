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
  updated_at: string
}

interface ThreadListProps {
  threads: MessageThread[]
  basePath?: string
}

export function ThreadList({ threads, basePath = '/messages' }: ThreadListProps) {
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

  return (
    <Stack gap="sm">
      {threads.map((thread) => (
        <Link key={thread.id} href={`${basePath}/${thread.id}`} className="block hover:opacity-90 transition-opacity">
          <Card>
            <CardContent>
              <Box p="md">
                <Stack gap="xs">
                  <Flex align="start" justify="between">
                    <H4 className="mb-0">
                      {thread.subject || 'No subject'}
                    </H4>
                    <Badge variant={thread.status === 'active' ? 'default' : 'secondary'}>
                      {thread.status}
                    </Badge>
                  </Flex>
                  <Small className="text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true })}
                  </Small>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Stack>
  )
}
