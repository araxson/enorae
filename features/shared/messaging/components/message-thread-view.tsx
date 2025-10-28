'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { MessageBubble } from './message-bubble'
import { MessageComposer } from './message-composer'
import { MessageSquare } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

interface Message {
  id: string
  from_user_id: string
  to_user_id: string
  content: string
  is_read: boolean
  created_at: string
}

interface MessageThreadViewProps {
  messages: Message[]
  currentUserId: string
  otherUserName?: string
  onSendMessage: (content: string) => Promise<{ error?: string }>
}

export function MessageThreadView({
  messages,
  currentUserId,
  otherUserName,
  onSendMessage,
}: MessageThreadViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex h-full flex-col gap-6">
      <Item variant="outline" className="flex min-h-96 flex-1 flex-col">
        <ItemHeader>
          <div className="flex flex-col gap-1">
            <ItemTitle>Conversation</ItemTitle>
            {otherUserName ? (
              <ItemDescription>Chatting with {otherUserName}</ItemDescription>
            ) : null}
          </div>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-1 flex-col">
            <ScrollArea className="flex-1">
              {messages.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageSquare className="h-6 w-6" aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyDescription>Start the conversation!</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex flex-col gap-3 pr-2">
                {messages.map((message) => {
                  const isOwn = message.from_user_id === currentUserId
                  return (
                    <MessageBubble
                      key={message.id}
                      content={message.content}
                      isOwn={isOwn}
                      senderName={isOwn ? 'You' : otherUserName}
                      timestamp={message.created_at}
                      isRead={message.is_read}
                    />
                  )
                })}
              </div>
            )}
            <div ref={messagesEndRef} />
            </ScrollArea>
          </div>
        </ItemContent>
      </Item>
      <MessageComposer onSend={onSendMessage} />
    </div>
  )
}
