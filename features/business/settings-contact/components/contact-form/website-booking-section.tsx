'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type PrimitiveValue = string | null | undefined

type WebsiteBookingSectionProps = {
  initialValues: {
    website_url: PrimitiveValue
    booking_url: PrimitiveValue
  }
  errors?: Record<string, string[]>
  isPending?: boolean
}

export function WebsiteBookingSection({ initialValues, errors, isPending }: WebsiteBookingSectionProps) {
  return (
    <FieldGroup className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="website_url">Website URL</FieldLabel>
        <FieldContent>
          <Input
            id="website_url"
            name="website_url"
            type="url"
            defaultValue={initialValues.website_url ?? ''}
            placeholder="https://www.yoursalon.com"
            aria-invalid={!!errors?.website_url}
            aria-describedby={errors?.website_url ? 'website_url-error' : undefined}
            disabled={isPending}
          />
          {errors?.website_url && (
            <p id="website_url-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.website_url[0]}
            </p>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="booking_url">Booking URL</FieldLabel>
        <FieldContent>
          <Input
            id="booking_url"
            name="booking_url"
            type="url"
            defaultValue={initialValues.booking_url ?? ''}
            placeholder="https://book.yoursalon.com"
            aria-invalid={!!errors?.booking_url}
            aria-describedby={errors?.booking_url ? 'booking_url-error' : undefined}
            disabled={isPending}
          />
          {errors?.booking_url && (
            <p id="booking_url-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.booking_url[0]}
            </p>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
