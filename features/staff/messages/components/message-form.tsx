'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { threadMessageSchema, type ThreadMessageFormData } from '@/features/staff/messages/schema'
import { sendThreadMessage } from '@/features/staff/messages/api/mutations'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

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
      <FieldSet className="gap-4">
        <FieldLegend>Compose message</FieldLegend>
        <Field>
          <FieldLabel htmlFor="content">Message</FieldLabel>
          <FieldContent>
            <Textarea
              id="content"
              placeholder="Type your message..."
              rows={4}
              {...register('content')}
            />
            {errors.content ? <FieldError>{errors.content.message}</FieldError> : null}
          </FieldContent>
        </Field>

        {error ? <FieldError>{error}</FieldError> : null}

        <ButtonGroup className="w-full sm:w-auto">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </Button>
        </ButtonGroup>
      </FieldSet>
    </form>
  )
}
