'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Stack, Flex } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send } from 'lucide-react'

interface MessageComposerProps {
  onSend: (content: string) => Promise<{ error?: string }>
  placeholder?: string
  disabled?: boolean
}

export function MessageComposer({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
}: MessageComposerProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Message cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await onSend(content.trim())

      if (result.error) {
        setError(result.error)
      } else {
        setContent('')
      }
    } catch {
      setError('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()

      if (!content.trim()) {
        setError('Message cannot be empty')
        return
      }

      setIsSubmitting(true)
      setError(null)

      const result = await onSend(content.trim())

      if (result.error) {
        setError(result.error)
      } else {
        setContent('')
      }

      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          rows={3}
          className="resize-none"
        />

        <Flex justify="between" align="center">
          <span className="text-xs text-muted-foreground">
            Press Ctrl+Enter to send
          </span>
          <Button
            type="submit"
            disabled={disabled || isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}
