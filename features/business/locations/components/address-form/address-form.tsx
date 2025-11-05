'use client'

import { useActionState, useEffect, useRef } from 'react'
import { ButtonGroup } from '@/components/ui/button-group'
import { updateLocationAddressAction } from '../../api/mutations'
import type { LocationAddress } from '../../api/types'
import {
  SubmitButton,
  StreetAddressFields,
  LocationDetailsFields,
  CoordinatesFields,
  FormMessages,
} from './index'

type Props = {
  locationId: string
  address: LocationAddress | null
  onSuccess?: () => void
}

export function AddressForm({ locationId, address, onSuccess }: Props) {
  const firstErrorRef = useRef<HTMLInputElement | null>(null)

  // Bind location ID to the action
  const updateWithLocationId = updateLocationAddressAction.bind(null, locationId)

  const [state, formAction, isPending] = useActionState(
    updateWithLocationId,
    null
  )

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Call onSuccess when form succeeds
  useEffect(() => {
    if (state?.success && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess()
      }, 2000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [state?.success, onSuccess])

  return (
    <div>
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {state?.message && !isPending && state.message}
      </div>

      <form action={formAction} noValidate>
        <div className="flex flex-col gap-6">
          <FormMessages state={state} />

          <StreetAddressFields
            isPending={isPending}
            errors={state?.errors}
            streetAddress={address?.street_address}
            addressLine2={address?.street_address_2}
            firstErrorRef={firstErrorRef}
          />

          <LocationDetailsFields
            isPending={isPending}
            errors={state?.errors}
            city={address?.city}
            state={address?.state_province}
            postalCode={address?.postal_code}
            country={address?.country_code}
          />

          <CoordinatesFields
            isPending={isPending}
            errors={state?.errors}
            latitude={address?.latitude}
            longitude={address?.longitude}
          />

          <ButtonGroup aria-label="Form actions">
            <SubmitButton />
          </ButtonGroup>
        </div>
      </form>
    </div>
  )
}
