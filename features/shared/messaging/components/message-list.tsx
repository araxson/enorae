'use client'

import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemGroup,
} from '@/components/ui/item'

interface Message {
  id: string
  from_user_id: string
  to_user_id: string
  content: string
  is_read: boolean
  created_at: string
}

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
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>Start the conversation!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup className="gap-3">
      {messages.map((message) => {
        const isOwnMessage = message.from_user_id === currentUserId
        return (
          <Item
            key={message.id}
            variant={isOwnMessage ? 'muted' : 'outline'}
            className={`max-w-xl flex-col gap-2 ${isOwnMessage ? 'ml-auto items-end text-right' : ''}`.trim()}
          >
            <ItemContent>
              <p className="whitespace-pre-wrap break-words leading-7">{message.content}</p>
            </ItemContent>
            <ItemFooter className={`gap-2 text-xs text-muted-foreground ${isOwnMessage ? 'justify-end' : ''}`}>
              <time dateTime={message.created_at} className="font-medium">
                {format(new Date(message.created_at), 'PPp')}
              </time>
              {isOwnMessage ? (
                <span
                  aria-label={message.is_read ? 'Message delivered and read' : 'Message sent'}
                  aria-hidden="true"
                >
                  {message.is_read ? '✓✓' : '✓'}
                </span>
              ) : null}
            </ItemFooter>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
