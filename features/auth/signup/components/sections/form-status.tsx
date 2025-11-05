'use client'

import type { SignupResult } from '../../api/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

type FormStatusProps = {
  state: SignupResult | { success: false }
  isPending: boolean
}

export function FormStatus({ state, isPending }: FormStatusProps): React.ReactElement {
  const hasErrors =
    state && 'errors' in state && state.errors && Object.keys(state.errors).length > 0

  return (
    <>
      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {state && 'error' in state && state.error && !isPending && state.error}
      </div>

      {/* Error summary */}
      {hasErrors && (
        <Alert variant="destructive" role="alert" tabIndex={-1}>
          <AlertCircle className="size-4" />
          <AlertTitle>
            There are {Object.keys('errors' in state && state.errors ? state.errors : {}).length} errors in the form
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {Object.entries('errors' in state && state.errors ? state.errors : {}).map(([field, messages]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    {field === '_form' ? 'Form' : field}: {(messages as string[])[0]}
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* General error */}
      {state && 'error' in state && state.error && !hasErrors && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="size-4" />
          <AlertTitle>Sign up failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {state && 'success' in state && state.success && 'message' in state && state.message && (
        <Alert className="border-green-200 bg-green-50 text-green-900" role="status">
          <CheckCircle2 className="size-4" />
          <AlertTitle>Account created successfully</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
