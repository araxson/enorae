'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface FormStatusProps {
  isPending: boolean
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export function FormStatus({ isPending, success, message, errors }: FormStatusProps) {
  const hasErrors = errors && Object.keys(errors).length > 0

  return (
    <>
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {message && !isPending && message}
      </div>

      {/* Error summary for screen readers and visual users */}
      {hasErrors && (
        <Alert variant="destructive" role="alert" tabIndex={-1}>
          <AlertCircle className="size-4" />
          <AlertTitle>There are {Object.keys(errors ?? {}).length} errors in the form</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {Object.entries(errors ?? {}).map(([field, messages]) => {
                const firstMessage = messages[0]
                return (
                  <li key={field}>
                    <a
                      href={`#${field}`}
                      className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      {field}: {firstMessage}
                    </a>
                  </li>
                )
              })}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {success && (
        <Alert variant="default" role="status" aria-live="polite">
          <CheckCircle2 className="size-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Message sent! We will get back to you soon.</AlertDescription>
        </Alert>
      )}
    </>
  )
}
