'use client'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
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
    <Stack gap="md">
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
            <Stack gap="sm">
              <p className="leading-7 whitespace-pre-wrap">{message.content}</p>
              {message.created_at && (
                <p className="text-sm text-muted-foreground text-xs">
                  {format(new Date(message.created_at), 'PPp')}
                  {message.is_edited && ' (edited)'}
                </p>
              )}
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}
