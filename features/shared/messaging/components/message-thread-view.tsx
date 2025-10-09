'use client'

import { useEffect, useRef } from 'react'
import { H3, Muted } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <H3>Conversation</H3>
        {otherUserName && <Muted>Chatting with {otherUserName}</Muted>}
      </div>

      <Separator />

      <div className="flex-1 min-h-[400px] overflow-y-auto">
        <Card>
          <CardContent>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="py-12 text-center">
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
            </div>
          </CardContent>
        </Card>
      </div>

      <MessageComposer onSend={onSendMessage} />
    </div>
  )
}
