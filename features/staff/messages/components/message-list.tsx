'use client'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Message } from '@/features/staff/messages/types'
import { cn } from '@/lib/utils'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <CardTitle>No messages</CardTitle>
            <CardDescription>Start chatting to see messages here.</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        const isFromMe = message.from_user_id === currentUserId

        return (
          <Card
            key={message.id}
            className={cn(
              'w-full max-w-xl',
              isFromMe ? 'ml-auto' : 'mr-auto'
            )}
          >
            <CardHeader>
              <div className="pb-2">
                <CardTitle>{isFromMe ? 'You' : 'Staff member'}</CardTitle>
                {message.created_at ? (
                  <CardDescription>
                    {format(new Date(message.created_at), 'PPp')}
                    {message.is_edited ? ' (edited)' : ''}
                  </CardDescription>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'rounded-md border border-border/50 bg-background px-4 py-3',
                  isFromMe ? 'bg-muted' : ''
                )}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
