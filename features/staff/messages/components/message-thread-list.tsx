'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { MessageCircle, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'

interface MessageThreadListProps {
  threads: MessageThread[]
}

const formatLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export function MessageThreadList({ threads }: MessageThreadListProps) {
  const router = useRouter()
  const [pendingArchiveId, setPendingArchiveId] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState(false)

  const confirmArchive = async () => {
    if (!pendingArchiveId) {
      return
    }

    setIsArchiving(true)
    try {
      await archiveThread(pendingArchiveId)
      toast.success('Thread archived')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to archive thread')
    } finally {
      setIsArchiving(false)
      setPendingArchiveId(null)
    }
  }

  if (threads.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageCircle className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No messages found</EmptyTitle>
          <EmptyDescription>Start a conversation to see it listed here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup className="gap-3">
      {threads.map((thread) => {
        if (!thread['id']) {
          return null
        }

        return (
          <Link key={thread['id']} href={`/staff/messages/${thread['id']}`} className="block">
            <Item
              variant={thread['unread_count_staff'] && thread['unread_count_staff'] > 0 ? 'muted' : 'outline'}
              className="flex-col gap-3"
            >
              <ItemHeader className="flex-wrap gap-2">
                <ItemTitle>{thread['subject'] || 'Conversation'}</ItemTitle>
                <ItemActions className="flex-none">
                  <ButtonGroup>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setPendingArchiveId(thread['id']!)
                      }}
                      aria-label="Archive thread"
                      disabled={isArchiving}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </ButtonGroup>
                </ItemActions>
              </ItemHeader>
              <ItemContent className="gap-2">
                {thread['last_message_at'] ? (
                  <ItemDescription>
                    Last message:{' '}
                    <time dateTime={thread['last_message_at']}>
                      {format(new Date(thread['last_message_at']), 'PPp')}
                    </time>
                  </ItemDescription>
                ) : null}

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
                  <ItemDescription>Customer ID: {thread['customer_id']}</ItemDescription>
                ) : null}
              </ItemContent>
            </Item>
          </Link>
        )
      })}
      <AlertDialog
        open={pendingArchiveId !== null}
        onOpenChange={(open) => {
          if (!open && !isArchiving) {
            setPendingArchiveId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this thread?</AlertDialogTitle>
            <AlertDialogDescription>
              Archiving removes the thread from your active inbox. You can still find it later in
              archived conversations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive} disabled={isArchiving}>
              {isArchiving ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" />
                  Archiving…
                </span>
              ) : (
                'Archive thread'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ItemGroup>
  )
}
