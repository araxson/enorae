'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { updateSalonInfoAction } from '@/features/business/settings-salon/api/actions'
import { FieldSet } from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  FormStatusAlerts,
  BusinessNameField,
  BusinessTypeField,
  EstablishedDateField,
} from './sections'

interface SalonInfoFormProps {
  salonId: string
  salonName: string | null
  businessName: string | null
  businessType: string | null
  establishedAt: string | null
}

export function SalonInfoForm({
  salonId,
  salonName,
  businessName,
  businessType,
  establishedAt,
}: SalonInfoFormProps) {
  const updateWithSalonId = updateSalonInfoAction.bind(null, salonId)
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
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Business Information</ItemTitle>
          <ItemDescription>
            Update your salon&apos;s business details and legal information
          </ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
        <FormStatusAlerts
          isPending={isPending}
          success={state?.success}
          message={state?.message}
          errors={state?.errors}
        />

        <form action={formAction} aria-describedby={hasErrors ? 'form-errors' : undefined}>
          <FieldSet className="flex flex-col gap-6">
            <BusinessNameField
              defaultValue={businessName || salonName || ''}
              isPending={isPending}
              errors={state?.errors?.['business_name']}
              firstErrorRef={firstErrorRef}
            />

            <BusinessTypeField
              defaultValue={businessType || ''}
              isPending={isPending}
              errors={state?.errors?.['business_type']}
            />

            <EstablishedDateField
              defaultValue={
                establishedAt ? new Date(establishedAt).toISOString().split('T')[0] : ''
              }
              isPending={isPending}
              errors={state?.errors?.['established_at']}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? (
                  <>
                    <span className="sr-only">Saving changes, please wait</span>
                    <span aria-hidden="true">Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </FieldSet>
        </form>
      </ItemContent>
    </Item>
  )
}
