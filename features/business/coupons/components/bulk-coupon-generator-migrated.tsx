'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FieldSet } from '@/components/ui/field'
import { AlertCircle } from 'lucide-react'
import { bulkGenerateCouponsAction } from '../api/mutations'
import {
  BasicInfoFields,
  DiscountFields,
  ValidityFields,
  LimitsFields,
  ActiveToggleField,
} from './generator/form-fields'

type BulkCouponGeneratorProps = {
  salonId: string
}

function SubmitButton() {
  return (
    <button
      type="submit"
      className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    >
      Generate Coupons
    </button>
  )
}

export function BulkCouponGenerator({ salonId }: BulkCouponGeneratorProps) {
  const [state, formAction] = useActionState(bulkGenerateCouponsAction, null)
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Coupon Generator</CardTitle>
        <CardDescription>Create batches of coupons for marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} noValidate aria-describedby={hasErrors ? 'form-errors' : undefined}>
          <input type="hidden" name="salon_id" value={salonId} />

          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {state?.message}
          </div>

          {/* Error summary for screen readers and keyboard users */}
          {hasErrors && (
            <div
              id="form-errors"
              role="alert"
              className="bg-destructive/10 border border-destructive p-4 rounded-md mb-6"
              tabIndex={-1}
            >
              <h2 className="font-semibold text-destructive mb-2">
                There are {Object.keys(state.errors ?? {}).length} errors in the form
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(state.errors ?? {}).map(([field, messages]) => (
                  <li key={field}>
                    <a
                      href={`#${field}`}
                      className="text-destructive underline hover:no-underline"
                    >
                      {field}: {(messages as string[])[0]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Server error message */}
          {state?.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {state?.success && (
            <Alert className="mb-6">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <FieldSet className="flex flex-col gap-6">
            <BasicInfoFields errors={state?.errors} ref={firstErrorRef} />
            <DiscountFields errors={state?.errors} />
            <ValidityFields errors={state?.errors} />
            <LimitsFields errors={state?.errors} />
            <ActiveToggleField errors={state?.errors} />

            <SubmitButton />
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
