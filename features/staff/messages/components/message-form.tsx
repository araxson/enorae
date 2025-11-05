'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { sendThreadMessageAction } from '@/features/staff/messages/api/actions'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface MessageFormProps {
  threadId: string
  onSuccess?: () => void
}

function SubmitButton() {
  return (
    <Button type="submit" className="w-full sm:w-auto" aria-busy="false">
      <Send className="size-4" />
      <span>Send Message</span>
    </Button>
  )
}

export function MessageForm({ threadId, onSuccess }: MessageFormProps) {
  const action = sendThreadMessageAction.bind(null, threadId)

  const [state, formAction] = useActionState(action, {
    success: false,
    message: '',
    errors: {},
  })

  const formRef = useRef<HTMLFormElement>(null)
  const firstErrorRef = useRef<HTMLTextAreaElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && Object.keys(state.errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Reset form and call onSuccess when message is sent
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      onSuccess?.()
    }
  }, [state?.success, onSuccess])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <div>
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {state?.message && !hasErrors && state.message}
      </div>

      {/* Error summary for accessibility */}
      {hasErrors && (
        <Alert variant="destructive" className="mb-6" tabIndex={-1}>
          <AlertTitle>
            Please fix {Object.keys(state.errors).length} error{Object.keys(state.errors).length === 1 ? '' : 's'}:
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(state.errors).map(([field, messages]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    className="underline hover:no-underline"
                  >
                    {field}: {(messages as string[])[0]}
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form ref={formRef} action={formAction} aria-describedby={hasErrors ? 'form-errors' : undefined}>
        <FieldSet className="gap-4">
          <FieldLegend>Compose message</FieldLegend>
          <Field>
            <FieldLabel htmlFor="content">
              Message
              <span className="text-destructive" aria-label="required"> *</span>
            </FieldLabel>
            <FieldContent>
              <Textarea
                ref={state?.errors?.['content'] ? firstErrorRef : null}
                id="content"
                name="content"
                placeholder="Type your message..."
                rows={4}
                required
                aria-required="true"
                aria-invalid={!!state?.errors?.['content']}
                aria-describedby={state?.errors?.['content'] ? 'content-error content-hint' : 'content-hint'}
              />
              <p id="content-hint" className="text-sm text-muted-foreground mt-1">
                Maximum 2000 characters
              </p>
              {state?.errors?.['content'] && (
                <FieldError id="content-error" role="alert">
                  {state.errors['content'][0]}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {state?.message && !state.success && !hasErrors && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Unable to send message</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert role="status" className="mt-4">
              <AlertTitle>Message sent</AlertTitle>
              <AlertDescription>We delivered your reply to the thread.</AlertDescription>
            </Alert>
          )}

          <ButtonGroup aria-label="Actions">
            <SubmitButton />
          </ButtonGroup>
        </FieldSet>
      </form>
    </div>
  )
}
