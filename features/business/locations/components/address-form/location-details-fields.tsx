'use client'

type LocationDetailsFieldsProps = {
  isPending: boolean
  errors?: Record<string, string[]>
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
}

export function LocationDetailsFields({
  isPending,
  errors,
  city,
  state,
  postalCode,
  country,
}: LocationDetailsFieldsProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold mb-4">Location Details</legend>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block font-medium mb-1">
            City
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors?.['city']}
            aria-describedby={errors?.['city'] ? 'city-error' : undefined}
            disabled={isPending}
            defaultValue={city || ''}
            placeholder="San Francisco"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['city'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['city'] && (
            <p id="city-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['city'][0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block font-medium mb-1">
            State/Province
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors?.['state']}
            aria-describedby={errors?.['state'] ? 'state-error' : undefined}
            disabled={isPending}
            defaultValue={state || ''}
            placeholder="CA"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['state'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['state'] && (
            <p id="state-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['state'][0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postal_code" className="block font-medium mb-1">
            Postal Code
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            id="postal_code"
            name="postal_code"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors?.['postal_code']}
            aria-describedby={errors?.['postal_code'] ? 'postal_code-error' : undefined}
            disabled={isPending}
            defaultValue={postalCode || ''}
            placeholder="94102"
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['postal_code'] ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors?.['postal_code'] && (
            <p id="postal_code-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['postal_code'][0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block font-medium mb-1">
            Country
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors?.['country']}
            aria-describedby={errors?.['country'] ? 'country-error country-hint' : 'country-hint'}
            disabled={isPending}
            defaultValue={country || 'US'}
            placeholder="US"
            maxLength={2}
            className={`w-full px-3 py-2 border rounded-md ${
              errors?.['country'] ? 'border-destructive' : 'border-input'
            }`}
          />
          <p id="country-hint" className="text-sm text-muted-foreground mt-1">
            2-letter country code (e.g., US, CA, GB)
          </p>
          {errors?.['country'] && (
            <p id="country-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['country'][0]}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  )
}
