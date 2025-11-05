'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Accordion } from '@/components/ui/accordion'
import { updateSalonSettingsAction } from '@/features/business/settings/api/actions'
import type { Database } from '@/lib/types/database.types'
// Form sections removed - settings form needs to be refactored
// TODO: Implement form sections inline or create new component files
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

type SalonSettings = Database['public']['Views']['salon_settings_view']['Row']

interface SettingsFormProps {
  salonId: string
  settings: SalonSettings | null
}

export function SettingsForm({ salonId, settings }: SettingsFormProps) {
  const updateWithSalonId = updateSalonSettingsAction.bind(null, salonId)
  const [state, formAction, isPending] = useActionState(updateWithSalonId, null)
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <div>
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {state?.message && !isPending && state.message}
      </div>

      {/* Error summary for screen readers and accessibility */}
      {hasErrors && (
        <Alert variant="destructive" className="mb-6" tabIndex={-1}>
          <AlertCircle className="size-4" />
          <AlertTitle>There are {Object.keys(state.errors).length} errors in the form</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {Object.entries(state.errors).map(([field, messages]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    className="underline hover:no-underline"
                  >
                    {field.replace(/_/g, ' ')}: {(messages as string[])[0]}
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {state?.success && (
        <Alert variant="default" className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="size-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      <form action={formAction} aria-describedby={hasErrors ? 'form-errors' : undefined}>
        <div className="flex flex-col gap-8">
          {/* TODO: Form sections need to be implemented */}
          <div className="text-center text-muted-foreground p-8 border rounded-lg">
            Settings form sections were removed and need to be refactored.
            This form requires BookingStatusSection, BookingRulesSection, and AccountLimitsSection components.
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <Spinner />
                  <span className="sr-only">Saving settings, please wait</span>
                  <span aria-hidden="true">Saving</span>
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
