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
}

export function WebsiteBookingSection({ initialValues }: WebsiteBookingSectionProps) {
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
          />
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
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
