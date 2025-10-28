'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '@/features/shared/messaging/api/mutations'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MessageList } from './message-list'
import { MessageComposerForm } from './message-composer-form'

interface Message {
  id: string
  from_user_id: string
  to_user_id: string
  content: string
  is_read: boolean
  created_at: string
}

interface MessageThreadProps {
  threadId: string
  messages: Message[]
  currentUserId: string
}

export function MessageThread({ threadId, messages, currentUserId }: MessageThreadProps) {
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const markAsRead = async () => {
      try {
        await markMessagesAsRead(threadId)
      } catch (err) {
        console.error('Failed to mark messages as read:', err)
      }
    }

    if (isMounted) {
      void markAsRead()
    }

    return () => {
      isMounted = false
    }
  }, [threadId])

  async function handleSend(content: string) {
    const result = await sendMessage({
      to_user_id: threadId,
      content,
    })

    if (!result.error) {
      router.refresh()
    }

    return { error: result.error || undefined }
  }

  return (
    <div className="space-y-6">
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Conversation</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Latest messages in this thread</ItemDescription>
          <div className="h-96">
            <ScrollArea>
              <MessageList messages={messages} currentUserId={currentUserId} />
            </ScrollArea>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Send a message</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <MessageComposerForm onSend={handleSend} />
        </ItemContent>
      </Item>
    </div>
  )
}
