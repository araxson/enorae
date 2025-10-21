'use client'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import type { Message } from '../types'
import { cn } from '@/lib/utils'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="leading-7 text-muted-foreground">No messages in this thread</p>
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
              'w-full max-w-xl p-4',
              isFromMe ? 'ml-auto bg-primary/10' : 'mr-auto'
            )}
          >
            <div className="flex flex-col gap-3">
              <p className="leading-7 whitespace-pre-wrap">{message.content}</p>
              {message.created_at && (
                <p className="text-sm text-muted-foreground text-xs">
                  {format(new Date(message.created_at), 'PPp')}
                  {message.is_edited && ' (edited)'}
                </p>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
