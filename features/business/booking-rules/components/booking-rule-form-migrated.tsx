'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { upsertBookingRule } from '@/features/business/booking-rules/api/mutations'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'
import {
  ServiceSelectionField,
  DurationFields,
  AdvanceBookingFields,
  FormStatusDisplay,
} from './sections'

interface BookingRuleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: BookingRuleWithService | null
  services: Array<{ id: string; name: string }>
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  return <Button type="submit">{isEdit ? 'Update Rule' : 'Create Rule'}</Button>
}

export function BookingRuleFormMigrated({
  open,
  onOpenChange,
  rule,
  services,
}: BookingRuleFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(upsertBookingRule, {})
  const firstErrorRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const isEditMode = Boolean(rule)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Close dialog and refresh on success
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
      formRef.current?.reset()
      router.refresh()
    }
  }, [state?.success, onOpenChange, router])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && formRef.current) {
      formRef.current.reset()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Create'} Booking Rule</DialogTitle>
          <DialogDescription>Configure booking constraints for a service</DialogDescription>
        </DialogHeader>

        <FormStatusDisplay
          isPending={isPending}
          success={state?.success}
          error={state?.error}
          errors={state?.errors}
        />

        <form ref={formRef} action={formAction} className="space-y-4">
          <ServiceSelectionField
            services={services}
            defaultValue={rule?.service_id ?? undefined}
            isEditMode={isEditMode}
            isPending={isPending}
            errors={state?.errors?.['serviceId']}
          />

          <DurationFields
            durationMinutes={rule?.duration_minutes ?? undefined}
            bufferMinutes={rule?.buffer_minutes ?? undefined}
            isPending={isPending}
            errors={state?.errors}
            firstErrorRef={firstErrorRef}
          />

          <AdvanceBookingFields
            minAdvanceBookingHours={rule?.min_advance_booking_hours ?? undefined}
            maxAdvanceBookingDays={rule?.max_advance_booking_days ?? undefined}
            isPending={isPending}
            errors={state?.errors}
          />

          <DialogFooter>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <SubmitButton isEdit={isEditMode} />
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
