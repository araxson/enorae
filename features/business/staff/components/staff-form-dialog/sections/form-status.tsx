'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'

type FormStatusProps = {
  state: {
    success?: boolean
    message?: string
    errors?: Record<string, string[]>
  } | null
  isPending: boolean
  isEditMode: boolean
}

export function FormStatus({ state, isPending, isEditMode }: FormStatusProps) {
  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <>
      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {state?.message && !isPending && state.message}
      </div>

      {/* Error summary */}
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
                  {field}: {messages[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Global error */}
      {state?.message && !state.success && !hasErrors && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {state?.success && (
        <Alert>
          <AlertDescription>
            Staff member {isEditMode ? 'updated' : 'created'} successfully!
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
