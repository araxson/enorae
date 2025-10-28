'use client'

import { MessageCircle } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { MessageBubble } from './message-bubble'

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
            <MessageCircle className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>Start the conversation!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => {
        const isOwnMessage = message.from_user_id === currentUserId
        return (
          <MessageBubble
            key={message.id}
            content={message.content}
            isOwn={isOwnMessage}
            timestamp={message.created_at}
            isRead={message.is_read}
          />
        )
      })}
    </div>
  )
}
