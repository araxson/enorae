'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Stack } from '@/components/layout'
import { Send } from 'lucide-react'
import { threadMessageSchema, type ThreadMessageFormData } from '../schema'
import { sendThreadMessage } from '../api/mutations'

interface MessageFormProps {
  threadId: string
  onSuccess?: () => void
}

export function MessageForm({ threadId, onSuccess }: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ThreadMessageFormData>({
    resolver: zodResolver(threadMessageSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: ThreadMessageFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await sendThreadMessage(threadId, data)
      reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <div>
          <Label htmlFor="content">Message</Label>
          <Textarea
            id="content"
            placeholder="Type your message..."
            rows={4}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </Stack>
    </form>
  )
}
