'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type PrimitiveValue = string | null | undefined

type MessagingHoursSectionProps = {
  whatsapp: PrimitiveValue
  telegram: PrimitiveValue
  hours: PrimitiveValue
}

export function MessagingHoursSection({ whatsapp, telegram, hours }: MessagingHoursSectionProps) {
  return (
    <FieldGroup className="flex flex-col gap-6">
      <FieldGroup className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="whatsapp_number">WhatsApp Number</FieldLabel>
          <FieldContent>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              defaultValue={whatsapp ?? ''}
              placeholder="+1 (555) 123-4567"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="telegram_username">Telegram Username</FieldLabel>
          <FieldContent>
            <Input
              id="telegram_username"
              name="telegram_username"
              defaultValue={telegram ?? ''}
              placeholder="@yoursalon"
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="hours_display_text">Hours Display Text</FieldLabel>
        <FieldContent>
          <Textarea
            id="hours_display_text"
            name="hours_display_text"
            defaultValue={hours ?? ''}
            placeholder="Mon-Fri: 9am - 6pm"
            rows={3}
          />
          <FieldDescription>Shown to customers across channels.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
