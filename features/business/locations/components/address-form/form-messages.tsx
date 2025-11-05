'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type FormMessagesProps = {
  state: {
    errors?: Record<string, string[]>
    message?: string
    success?: boolean
  } | null
}

export function FormMessages({ state }: FormMessagesProps) {
  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <>
      {/* Error summary for accessibility */}
      {hasErrors && (
        <div
          role="alert"
          className="bg-destructive/10 border border-destructive p-4 rounded-md"
          tabIndex={-1}
        >
          <h2 className="font-semibold text-destructive mb-2">
            There are {Object.keys(state.errors!).length} errors in the form
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(state.errors!).map(([field, messages]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="text-destructive underline hover:no-underline"
                >
                  {field.replace('_', ' ')}: {messages[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Global error message */}
      {state?.message && !state.success && !hasErrors && (
        <Alert variant="destructive">
          <AlertTitle>Update failed</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {state?.success && (
        <Alert>
          <AlertTitle>Address updated</AlertTitle>
          <AlertDescription>Address updated successfully!</AlertDescription>
        </Alert>
      )}
    </>
  )
}
