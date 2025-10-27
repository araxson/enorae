'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '@/features/shared/messaging/api/mutations'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { MessageCircle } from 'lucide-react'

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
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function handleSend() {
    if (!newMessage.trim()) return

    setIsSending(true)
    setError(null)

    const result = await sendMessage({
      to_user_id: threadId,
      content: newMessage,
    })

    setIsSending(false)

    if (result.error) {
      setError(result.error)
    } else {
      setNewMessage('')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>Latest messages in this thread</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {messages.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircle className="h-6 w-6" aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyDescription>Start the conversation!</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
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
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Message failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Field>
              <FieldLabel htmlFor="message-content">Message</FieldLabel>
              <FieldContent>
                <Textarea
                  id="message-content"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  rows={3}
                  disabled={isSending}
                />
                <FieldDescription>
                  Press{' '}
                  <KbdGroup>
                    <Kbd>Shift</Kbd>
                    <span>+</span>
                    <Kbd>Enter</Kbd>
                  </KbdGroup>{' '}
                  to add a new line.
                </FieldDescription>
              </FieldContent>
            </Field>
            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={isSending || !newMessage.trim()}>
                {isSending ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send message</span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
