'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Send } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

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

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()

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
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Message error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Field>
        <FieldLabel htmlFor="message-composer">Message</FieldLabel>
        <FieldContent>
          <Textarea
            id="message-composer"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            rows={3}
          />
          <FieldDescription>
            Message recipients are notified instantly.
          </FieldDescription>
        </FieldContent>
      </Field>

      <ButtonGroup aria-label="Actions">
        <ButtonGroupText asChild>
          <span className="flex items-center gap-1 text-sm">
            Press
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            to send
          </span>
        </ButtonGroupText>
        <div className="hidden sm:block">
          <ButtonGroupSeparator />
        </div>
        <Button
          type="submit"
          disabled={disabled || isSubmitting || !content.trim()}
        >
          {isSubmitting ? (
            <>
              <Spinner />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              <span>Send message</span>
            </>
          )}
        </Button>
      </ButtonGroup>
    </form>
  )
}
