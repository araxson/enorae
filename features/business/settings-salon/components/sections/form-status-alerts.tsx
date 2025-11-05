'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormStatusAlertsProps {
  isPending: boolean
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export function FormStatusAlerts({ isPending, success, message, errors }: FormStatusAlertsProps) {
  const hasErrors = errors && Object.keys(errors).length > 0

  return (
    <>
      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {message && !isPending && message}
      </div>

      {/* Error summary */}
      {hasErrors && (
        <Alert variant="destructive" className="mb-6" tabIndex={-1}>
          <AlertCircle className="size-4" />
          <AlertTitle>There are {Object.keys(errors).length} errors in the form</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {Object.entries(errors).map(([field, messages]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline hover:no-underline">
                    {field.replace(/_/g, ' ')}: {messages[0]}
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {success && (
        <Alert variant="default" className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="size-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
