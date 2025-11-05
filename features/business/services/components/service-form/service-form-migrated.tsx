'use client'

import { useActionState, useEffect, useRef } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createServiceAction, updateServiceAction } from '../../api/mutations'
import type { Database } from '@/lib/types/database.types'
import { SubmitButton } from './submit-button'
import { Button } from '@/components/ui/button'
import { BasicInfoSection, PricingDurationSection, BookingSettingsSection, FormErrorSummary } from './sections'

type Service = Database['public']['Views']['services_view']['Row']

type ServiceFormMigratedProps = {
  salonId: string
  service?: Service | null
  onClose: () => void
}

export function ServiceFormMigrated({ salonId, service, onClose }: ServiceFormMigratedProps) {
  const isEditMode = !!service
  const firstErrorRef = useRef<HTMLInputElement>(null)

  const createWithSalonId = createServiceAction.bind(null, salonId)
  const updateWithServiceId = service?.id
    ? updateServiceAction.bind(null, service.id)
    : createWithSalonId

  const [state, formAction, isPending] = useActionState(
    isEditMode ? updateWithServiceId : createWithSalonId,
    null
  )

  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogDescription>
          {isEditMode
            ? 'Update service details, pricing, and booking rules.'
            : 'Create a new service for your salon. Set pricing and duration.'}
        </DialogDescription>
      </DialogHeader>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {state?.message && !isPending && state.message}
      </div>

      {hasErrors && state.errors && <FormErrorSummary errors={state.errors} />}

      {state?.message && !state.success && !hasErrors && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <form action={formAction} className="space-y-6" noValidate>
        <BasicInfoSection
          errors={state?.errors}
          isPending={isPending}
          serviceName={service?.name}
          serviceDescription={service?.description}
          firstErrorRef={firstErrorRef}
        />

        <PricingDurationSection
          errors={state?.errors}
          isPending={isPending}
          basePrice={service?.sale_price ?? undefined}
          durationMinutes={service?.duration_minutes}
          bufferMinutes={service?.buffer_minutes}
        />

        <BookingSettingsSection
          errors={state?.errors}
          isPending={isPending}
          isOnlineBookingEnabled={undefined}
          requiresDeposit={undefined}
          depositAmount={undefined}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <SubmitButton isEditMode={isEditMode} />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
