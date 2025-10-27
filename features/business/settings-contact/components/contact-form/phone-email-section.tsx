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
}

export function PhoneEmailSection({ initialValues }: PhoneEmailSectionProps) {
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
          />
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
          />
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
          />
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
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
