'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        rows={3}
        className="resize-none"
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Press Ctrl+Enter to send</span>
        <Button type="submit" disabled={disabled || isSubmitting || !content.trim()} className="gap-2">
          {isSubmitting ? 'Sending...' : <Send className="h-4 w-4" />}
          {isSubmitting ? null : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
