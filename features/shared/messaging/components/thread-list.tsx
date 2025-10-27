'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MessageSquare } from 'lucide-react'

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

export function ThreadList({
  threads,
  basePath = '/messages',
  currentUserRole = 'customer',
}: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquare className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>Messages will appear once you start a conversation.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Start a new thread to connect with salons and staff.</EmptyContent>
      </Empty>
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

  const getUnreadCount = (thread: MessageThread) =>
    currentUserRole === 'customer'
      ? thread.unread_count_customer || 0
      : thread.unread_count_staff || 0

  return (
    <ItemGroup className="gap-3">
      {threads.map((thread) => {
        const unreadCount = getUnreadCount(thread)

        return (
          <Link key={thread.id} href={`${basePath}/${thread.id}`} className="block">
            <Item variant={unreadCount > 0 ? 'muted' : 'outline'} className="flex-col gap-3">
              <ItemHeader>
                <ItemTitle>{thread.subject || 'No subject'}</ItemTitle>
                {unreadCount > 0 ? <Badge variant="destructive">{unreadCount}</Badge> : null}
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Updated {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true })}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={getPriorityVariant(thread.priority)}>
                  {thread.priority.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
                <Badge variant={thread.status === 'active' ? 'default' : 'secondary'}>
                  {thread.status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              </ItemActions>
            </Item>
          </Link>
        )
      })}
    </ItemGroup>
  )
}
