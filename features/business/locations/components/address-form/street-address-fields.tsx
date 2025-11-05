'use client'

import type { RefObject } from 'react'

type StreetAddressFieldsProps = {
  isPending: boolean
  errors?: Record<string, string[]>
  streetAddress?: string | null
  addressLine2?: string | null
  firstErrorRef: RefObject<HTMLInputElement | null>
}

export function StreetAddressFields({
  isPending,
  errors,
  streetAddress,
  addressLine2,
  firstErrorRef,
}: StreetAddressFieldsProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold mb-4">Street Address</legend>

      <div>
        <label htmlFor="street_address" className="block font-medium mb-1">
          Street Address
          <span className="text-destructive" aria-label="required"> *</span>
        </label>
        <input
          ref={errors?.['street_address'] ? firstErrorRef : null}
          id="street_address"
          name="street_address"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors?.['street_address']}
          aria-describedby={errors?.['street_address'] ? 'street_address-error' : undefined}
          disabled={isPending}
          defaultValue={streetAddress || ''}
          placeholder="123 Main Street"
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['street_address'] ? 'border-destructive' : 'border-input'
          }`}
        />
        {errors?.['street_address'] && (
          <p id="street_address-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['street_address'][0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address_line_2" className="block font-medium mb-1">
          Address Line 2 (Optional)
        </label>
        <input
          id="address_line_2"
          name="address_line_2"
          type="text"
          aria-invalid={!!errors?.['address_line_2']}
          aria-describedby={errors?.['address_line_2'] ? 'address_line_2-error address_line_2-hint' : 'address_line_2-hint'}
          disabled={isPending}
          defaultValue={addressLine2 || ''}
          placeholder="Suite 100"
          className={`w-full px-3 py-2 border rounded-md ${
            errors?.['address_line_2'] ? 'border-destructive' : 'border-input'
          }`}
        />
        <p id="address_line_2-hint" className="text-sm text-muted-foreground mt-1">
          Apartment, suite, unit, building, floor, etc.
        </p>
        {errors?.['address_line_2'] && (
          <p id="address_line_2-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['address_line_2'][0]}
          </p>
        )}
      </div>
    </fieldset>
  )
}
