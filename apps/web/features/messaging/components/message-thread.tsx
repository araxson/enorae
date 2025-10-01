'use client'

import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@enorae/ui'
import { ScrollArea } from '@enorae/ui'
import { markMessagesAsRead } from '../dal/queries'

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
  sender: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

interface MessageThreadProps {
  messages: Message[]
  currentUserId: string
  conversationId: string
}

export function MessageThread({ messages, currentUserId, conversationId }: MessageThreadProps) {
  useEffect(() => {
    // Mark messages as read when viewing
    markMessagesAsRead(conversationId, currentUserId)
  }, [conversationId, currentUserId])

  return (
    <ScrollArea className="h-[500px] px-4">
      <div className="space-y-4">
        {(messages as any[]).map((message: any) => {
          const isOwn = message.sender_id === currentUserId
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwn && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatar_url} />
                  <AvatarFallback>
                    {message.sender.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <time className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </time>
              </div>
              {isOwn && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatar_url} />
                  <AvatarFallback>
                    {message.sender.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}