'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '../api/mutations'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Stack, Flex } from '@/components/layout'
import { P, Small } from '@/components/ui/typography'
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
  threadId: string  // NOTE: Now represents otherUserId in direct messaging system
  messages: Message[]
  currentUserId: string
}

export function MessageThread({ threadId, messages, currentUserId }: MessageThreadProps) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mark messages as read when component mounts
  useEffect(() => {
    markMessagesAsRead(threadId)
  }, [threadId])

  async function handleSend() {
    if (!newMessage.trim()) return

    setIsSending(true)
    setError(null)

    const result = await sendMessage({
      to_user_id: threadId,  // threadId now represents the other user's ID
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
    <Stack gap="lg">
      {/* Messages list */}
      <Card className="bg-muted/20">
        <ScrollArea className="h-[600px] p-4">
          <Stack gap="md">
            {messages.length === 0 ? (
              <P className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </P>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.from_user_id === currentUserId
                return (
                  <Flex key={message.id} justify={isOwnMessage ? 'end' : 'start'}>
                    <Card className={isOwnMessage ? 'bg-primary text-primary-foreground' : ''}>
                      <CardContent className="p-3 max-w-md">
                        <P className="mb-2">{message.content}</P>
                        <Small className={isOwnMessage ? 'opacity-70' : 'text-muted-foreground'}>
                          {format(new Date(message.created_at), 'PPp')}
                        </Small>
                      </CardContent>
                    </Card>
                  </Flex>
                )
              })
            )}
          </Stack>
        </ScrollArea>
      </Card>

      {/* Message composer */}
      <Card>
        <CardContent className="p-4">
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
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              disabled={isSending}
            />
            <Flex justify="end">
              <Button onClick={handleSend} disabled={isSending || !newMessage.trim()}>
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
