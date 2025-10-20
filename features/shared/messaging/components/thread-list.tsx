'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
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
        <CardContent className="py-12 text-center">
          <p className="leading-7 text-muted-foreground">No messages yet</p>
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
              <CardContent className="space-y-2 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-0">
                        {thread.subject || 'No subject'}
                      </h4>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="flex h-6 min-w-6 items-center justify-center rounded-full">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <small className="text-sm font-medium leading-none text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true })}
                    </small>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getPriorityVariant(thread.priority)}>{thread.priority}</Badge>
                    <Badge variant={thread.status === 'active' ? 'default' : 'secondary'}>
                      {thread.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
