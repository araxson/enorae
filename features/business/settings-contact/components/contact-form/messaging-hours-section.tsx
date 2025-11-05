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
  errors?: Record<string, string[]>
  isPending?: boolean
}

export function MessagingHoursSection({ whatsapp, telegram, hours, errors, isPending }: MessagingHoursSectionProps) {
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
              aria-invalid={!!errors?.whatsapp_number}
              aria-describedby={errors?.whatsapp_number ? 'whatsapp_number-error' : undefined}
              disabled={isPending}
            />
            {errors?.whatsapp_number && (
              <p id="whatsapp_number-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.whatsapp_number[0]}
              </p>
            )}
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
              aria-invalid={!!errors?.telegram_username}
              aria-describedby={errors?.telegram_username ? 'telegram_username-error' : undefined}
              disabled={isPending}
            />
            {errors?.telegram_username && (
              <p id="telegram_username-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.telegram_username[0]}
              </p>
            )}
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
            aria-invalid={!!errors?.hours_display_text}
            aria-describedby={errors?.hours_display_text ? 'hours_display_text-error hours_display_text-hint' : 'hours_display_text-hint'}
            disabled={isPending}
          />
          <FieldDescription id="hours_display_text-hint">Shown to customers across channels.</FieldDescription>
          {errors?.hours_display_text && (
            <p id="hours_display_text-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.hours_display_text[0]}
            </p>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
