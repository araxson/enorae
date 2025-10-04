'use client'

import { useEffect, useRef } from 'react'
import { Stack } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MessageBubble } from './message-bubble'
import { MessageComposer } from './message-composer'

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <Stack gap="lg" className="h-full">
      {/* Header */}
      <div>
        <H3>Conversation</H3>
        {otherUserName && (
          <Muted>
            Chatting with {otherUserName}
          </Muted>
        )}
      </div>

      <Separator />

      {/* Messages */}
      <Card className="flex-1 overflow-y-auto p-6 min-h-[400px] max-h-[600px]">
        <Stack gap="md">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Muted>No messages yet. Start the conversation!</Muted>
            </div>
          ) : (
            messages.map((message) => {
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
            })
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Card>

      {/* Composer */}
      <MessageComposer onSend={onSendMessage} />
    </Stack>
  )
}
