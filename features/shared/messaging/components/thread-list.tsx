'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export function ThreadList({
  threads,
  basePath = '/messages',
  currentUserRole = 'customer',
}: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <Card>
        <CardHeader className="items-center">
          <CardTitle>No messages yet</CardTitle>
          <CardDescription>Messages will appear once you start a conversation.</CardDescription>
        </CardHeader>
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

  const getUnreadCount = (thread: MessageThread) =>
    currentUserRole === 'customer'
      ? thread.unread_count_customer || 0
      : thread.unread_count_staff || 0

  return (
    <div className="space-y-3">
      {threads.map((thread) => {
        const unreadCount = getUnreadCount(thread)

        return (
          <Link
            key={thread.id}
            href={`${basePath}/${thread.id}`}
            className="block transition-opacity hover:opacity-95"
          >
            <Card className={`${unreadCount > 0 ? 'border-primary' : ''}`.trim()}>
              <CardHeader className="space-y-2 p-5 pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{thread.subject || 'No subject'}</CardTitle>
                  {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
                </div>
                <CardDescription>
                  Updated {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2 p-5 pt-4">
                <Badge variant={getPriorityVariant(thread.priority)}>
                  {thread.priority.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
                <Badge variant={thread.status === 'active' ? 'default' : 'secondary'}>
                  {thread.status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
