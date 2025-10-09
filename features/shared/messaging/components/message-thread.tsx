'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '../api/mutations'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { P, Small } from '@/components/ui/typography'
import { AlertCircle } from 'lucide-react'
import { Stack } from '@/components/layout'

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
    markMessagesAsRead(threadId)
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
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <P className="py-8 text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </P>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.from_user_id === currentUserId
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] space-y-1 ${isOwnMessage ? 'text-right' : ''}`}>
                        <div
                          className={`rounded-lg border px-4 py-2 text-left ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
                        >
                          <P className="mb-0 whitespace-pre-wrap break-words">{message.content}</P>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs text-muted-foreground ${isOwnMessage ? 'justify-end' : ''}`}
                        >
                          <Small>{format(new Date(message.created_at), 'PPp')}</Small>
                          {isOwnMessage && <Small>{message.is_read ? '✓✓' : '✓'}</Small>}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack gap="sm">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              rows={3}
              disabled={isSending}
            />
            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={isSending || !newMessage.trim()}>
                {isSending ? 'Sending...' : 'Send message'}
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}
