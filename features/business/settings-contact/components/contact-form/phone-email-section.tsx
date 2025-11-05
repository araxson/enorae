'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type PrimitiveValue = string | null | undefined

type PhoneEmailSectionProps = {
  initialValues: {
    primary_phone: PrimitiveValue
    secondary_phone: PrimitiveValue
    primary_email: PrimitiveValue
    booking_email: PrimitiveValue
  }
  errors?: Record<string, string[]>
  isPending?: boolean
}

export function PhoneEmailSection({ initialValues, errors, isPending }: PhoneEmailSectionProps) {
  return (
    <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="primary_phone">Primary phone</FieldLabel>
        <FieldContent>
          <Input
            id="primary_phone"
            name="primary_phone"
            type="tel"
            defaultValue={initialValues.primary_phone ?? ''}
            placeholder="+1 (555) 123-4567"
            aria-invalid={!!errors?.primary_phone}
            aria-describedby={errors?.primary_phone ? 'primary_phone-error' : undefined}
            disabled={isPending}
          />
          {errors?.primary_phone && (
            <p id="primary_phone-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.primary_phone[0]}
            </p>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="secondary_phone">Secondary phone</FieldLabel>
        <FieldContent>
          <Input
            id="secondary_phone"
            name="secondary_phone"
            type="tel"
            defaultValue={initialValues.secondary_phone ?? ''}
            placeholder="+1 (555) 987-6543"
            aria-invalid={!!errors?.secondary_phone}
            aria-describedby={errors?.secondary_phone ? 'secondary_phone-error' : undefined}
            disabled={isPending}
          />
          {errors?.secondary_phone && (
            <p id="secondary_phone-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.secondary_phone[0]}
            </p>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="primary_email">Primary email</FieldLabel>
        <FieldContent>
          <Input
            id="primary_email"
            name="primary_email"
            type="email"
            defaultValue={initialValues.primary_email ?? ''}
            placeholder="contact@salon.com"
            aria-invalid={!!errors?.primary_email}
            aria-describedby={errors?.primary_email ? 'primary_email-error' : undefined}
            disabled={isPending}
          />
          {errors?.primary_email && (
            <p id="primary_email-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.primary_email[0]}
            </p>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="booking_email">Booking email</FieldLabel>
        <FieldContent>
          <Input
            id="booking_email"
            name="booking_email"
            type="email"
            defaultValue={initialValues.booking_email ?? ''}
            placeholder="bookings@salon.com"
            aria-invalid={!!errors?.booking_email}
            aria-describedby={errors?.booking_email ? 'booking_email-error' : undefined}
            disabled={isPending}
          />
          {errors?.booking_email && (
            <p id="booking_email-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.booking_email[0]}
            </p>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
