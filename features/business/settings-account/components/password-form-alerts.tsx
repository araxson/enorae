'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'

type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export function FormErrorSummary({ errors }: { errors: Record<string, string[]> }) {
  return (
    <div
      role="alert"
      className="bg-destructive/10 border border-destructive p-4 rounded-md mb-6"
      tabIndex={-1}
    >
      <h2 className="font-semibold text-destructive mb-2">There are errors in the form</h2>
      <ul className="list-disc list-inside space-y-1">
        {Object.entries(errors).map(([field, messages]) => (
          <li key={field}>
            <a href={`#${field}`} className="text-destructive underline hover:no-underline">
              {field}: {messages?.[0]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FormStatusAlerts({ state }: { state: FormState }) {
  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <>
      {state?.success && (
        <Alert>
          <CheckCircle className="size-4" />
          <AlertTitle>Password updated</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state?.message && !state.success && !hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Update failed</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
