'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { MessageCircle, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { archiveThread } from '@/features/staff/messages/api/mutations'
import type { MessageThread } from '@/features/staff/messages/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'

interface MessageThreadListProps {
  threads: MessageThread[]
}

const formatLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

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
      <Card>
        <CardHeader>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircle className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No messages found</EmptyTitle>
              <EmptyDescription>Start a conversation to see it listed here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {threads.map((thread) => {
        if (!thread['id']) {
          return null
        }

        return (
          <Link key={thread['id']} href={`/staff/messages/${thread['id']}`} className="block">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <CardTitle>{thread['subject']}</CardTitle>
                    {thread['last_message_at'] ? (
                      <CardDescription>
                        Last message: {format(new Date(thread['last_message_at']), 'PPp')}
                      </CardDescription>
                    ) : null}
                  </div>

                  <ButtonGroup>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => handleArchive(thread['id']!, event)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {thread['unread_count_staff'] && thread['unread_count_staff'] > 0 ? (
                      <Badge variant="default">{thread['unread_count_staff']} unread</Badge>
                    ) : null}
                    <Badge variant="outline">
                      {thread['status'] ? formatLabel(thread['status']) : 'Unknown'}
                    </Badge>
                    {thread['priority'] && thread['priority'] !== 'normal' ? (
                      <Badge variant="destructive">{formatLabel(thread['priority'])}</Badge>
                    ) : null}
                  </div>

                  {thread['customer_id'] ? (
                    <CardDescription>Customer ID: {thread['customer_id']}</CardDescription>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
