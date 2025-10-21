'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '../api/mutations'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'

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
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>Latest messages in this thread</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="leading-7 py-8 text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.from_user_id === currentUserId
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xl space-y-1 ${isOwnMessage ? 'text-right' : ''}`}>
                        <div
                          className={`rounded-lg border px-4 py-2 text-left ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
                        >
                          <p className="leading-7 mb-0 whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs text-muted-foreground ${isOwnMessage ? 'justify-end' : ''}`}
                        >
                          <small className="text-sm font-medium">{format(new Date(message.created_at), 'PPp')}</small>
                          {isOwnMessage && <small className="text-sm font-medium">{message.is_read ? '✓✓' : '✓'}</small>}
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
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
