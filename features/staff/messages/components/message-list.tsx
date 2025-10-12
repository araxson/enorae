'use client'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import type { Message } from '../types'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <P className="text-muted-foreground">No messages in this thread</P>
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
            className={`p-4 ${isFromMe ? 'ml-auto bg-primary/10' : 'mr-auto'} max-w-[80%]`}
          >
            <Stack gap="sm">
              <P className="whitespace-pre-wrap">{message.content}</P>
              {message.created_at && (
                <Muted className="text-xs">
                  {format(new Date(message.created_at), 'PPp')}
                  {message.is_edited && ' (edited)'}
                </Muted>
              )}
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}
