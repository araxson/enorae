'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      <Card className="flex min-h-96 flex-1 flex-col">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          {otherUserName && <CardDescription>Chatting with {otherUserName}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <span className="text-muted-foreground">No messages yet. Start the conversation!</span>
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
        </CardContent>
      </Card>
      <MessageComposer onSend={onSendMessage} />
    </div>
  )
}
