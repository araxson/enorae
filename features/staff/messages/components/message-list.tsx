'use client'
import { Fragment } from 'react'
import { format } from 'date-fns'
import { MessageCircle } from 'lucide-react'
import type { Message } from '@/features/staff/messages/types'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageCircle className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>Start chatting to see conversation history here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => {
        const isFromMe = message['from_user_id'] === currentUserId

        return (
          <Fragment key={message['id']}>
            <article
              className={cn(
                'flex w-full max-w-xl flex-col gap-1',
                isFromMe ? 'ml-auto items-end' : 'mr-auto items-start'
              )}
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {isFromMe ? 'You' : 'Staff member'}
                </span>
                {message['created_at'] ? (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message['created_at']), 'PPp')}
                    {message['is_edited'] ? ' (edited)' : ''}
                  </span>
                ) : null}
              </div>
              <div
                className={cn(
                  'max-w-full rounded-lg px-4 py-3',
                  isFromMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message['content']}</p>
              </div>
            </article>
            {index < messages.length - 1 ? <Separator /> : null}
          </Fragment>
        )
      })}
    </div>
  )
}
