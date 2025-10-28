'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

interface MessageComposerFormProps {
  onSend: (message: string) => Promise<{ error?: string }>
  disabled?: boolean
}

export function MessageComposerForm({ onSend, disabled = false }: MessageComposerFormProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    if (!message.trim()) return

    setIsSending(true)
    setError(null)

    const result = await onSend(message)

    setIsSending(false)

    if (result.error) {
      setError(result.error)
    } else {
      setMessage('')
    }
  }

  return (
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
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            disabled={isSending || disabled}
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
        <Button onClick={handleSend} disabled={isSending || !message.trim() || disabled}>
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
  )
}
