'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createBlockedTimeAction, updateBlockedTimeAction } from '../api/actions'
import type { BlockedTime } from '@/features/staff/blocked-times/api/types'
import {
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { TIME_MS } from '@/lib/config/constants'
import { TimeRangeFields, BlockTypeField, ReasonField, RecurringField } from './sections'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface BlockedTimeFormProps {
  blockedTime?: BlockedTime
  onSuccess?: () => void
  onCancel?: () => void
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  return (
    <Button type="submit" aria-busy="false">
      {isEditing ? 'Update' : 'Create'}
    </Button>
  )
}

export function BlockedTimeForm({ blockedTime, onSuccess, onCancel }: BlockedTimeFormProps) {
  const isEditing = !!blockedTime?.id
  const action = isEditing ? updateBlockedTimeAction.bind(null, blockedTime.id) : createBlockedTimeAction

  const [state, formAction] = useActionState(action, {
    success: false,
    message: '',
    errors: {},
  })

  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && Object.keys(state.errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Call onSuccess when form succeeds
  useEffect(() => {
    if (state?.success) {
      onSuccess?.()
    }
  }, [state?.success, onSuccess])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  // Default values for new form
  const defaultStartTime = blockedTime?.start_time
    ? new Date(blockedTime.start_time).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16)
  const defaultEndTime = blockedTime?.end_time
    ? new Date(blockedTime.end_time).toISOString().slice(0, 16)
    : new Date(Date.now() + TIME_MS.ONE_HOUR).toISOString().slice(0, 16)

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
                    {field.replace(/_/g, ' ')}: {(messages as string[])[0]}
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form action={formAction} aria-describedby={hasErrors ? 'form-errors' : undefined}>
        <FieldSet>
          <FieldLegend>Timing</FieldLegend>
          <FieldGroup className="@md/field-group:grid @md/field-group:grid-cols-2">
            <TimeRangeFields
              startError={state?.errors?.['start_time']?.[0]}
              endError={state?.errors?.['end_time']?.[0]}
              defaultStartTime={defaultStartTime}
              defaultEndTime={defaultEndTime}
              firstErrorRef={firstErrorRef}
            />
          </FieldGroup>

          <FieldSeparator />

          <BlockTypeField
            defaultValue={blockedTime?.block_type}
            error={state?.errors?.['block_type']?.[0]}
          />

          <ReasonField
            defaultValue={blockedTime?.reason ?? null}
            error={state?.errors?.['reason']?.[0]}
          />

          <RecurringField
            defaultValue={blockedTime?.is_recurring}
            error={state?.errors?.['is_recurring']?.[0]}
          />

          {state?.message && !state.success && !hasErrors && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Unable to save blocked time</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert className="mt-4" role="status">
              <AlertTitle>
                {isEditing ? 'Blocked time updated' : 'Blocked time created'}
              </AlertTitle>
              <AlertDescription>
                {isEditing
                  ? 'Your existing blocked time has been updated.'
                  : 'Your new blocked time is now scheduled.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <ButtonGroup>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <SubmitButton isEditing={isEditing} />
            </ButtonGroup>
          </div>
        </FieldSet>
      </form>
    </div>
  )
}
