'use client'
import { Fragment } from 'react'
import { format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MessageCircle } from 'lucide-react'
import type { Message } from '@/features/staff/messages/types'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Alert className="flex flex-col items-center gap-3 py-8">
        <MessageCircle className="h-12 w-12 text-muted-foreground" />
        <AlertTitle>No messages</AlertTitle>
        <AlertDescription>Start chatting to see messages here.</AlertDescription>
      </Alert>
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
