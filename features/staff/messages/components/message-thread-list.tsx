'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { MessageCircle, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { archiveThread } from '../api/mutations'
import type { MessageThread } from '../types'

interface MessageThreadListProps {
  threads: MessageThread[]
}

export function MessageThreadList({ threads }: MessageThreadListProps) {
  const handleArchive = async (threadId: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Are you sure you want to archive this thread?')) return

    try {
      await archiveThread(threadId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to archive thread')
    }
  }

  if (threads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="leading-7 text-muted-foreground">No messages found</p>
      </Card>
    )
  }

  return (
    <Stack gap="md">
      {threads.map((thread) => (
        <Link key={thread.id} href={`/staff/messages/${thread.id}`}>
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <Flex justify="between" align="start">
              <Stack gap="sm" className="flex-1">
                <Flex align="center" gap="sm">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{thread.subject}</h3>
                  {thread.unread_count_staff && thread.unread_count_staff > 0 && (
                    <Badge variant="default">
                      {thread.unread_count_staff} unread
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {thread.status}
                  </Badge>
                  {thread.priority !== 'normal' && (
                    <Badge variant="destructive" className="capitalize">
                      {thread.priority}
                    </Badge>
                  )}
                </Flex>

                {thread.customer_name && (
                  <p className="leading-7 text-sm">Customer: {thread.customer_name}</p>
                )}

                {thread.last_message_at && (
                  <p className="text-sm text-muted-foreground">
                    Last message: {format(new Date(thread.last_message_at || ''), 'PPp')}
                  </p>
                )}
              </Stack>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => thread.id && handleArchive(thread.id, e)}
              >
                <Archive className="h-4 w-4" />
              </Button>
            </Flex>
          </Card>
        </Link>
      ))}
    </Stack>
  )
}
