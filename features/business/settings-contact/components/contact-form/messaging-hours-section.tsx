'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PrimitiveValue = string | null | undefined

type MessagingHoursSectionProps = {
  whatsapp: PrimitiveValue
  telegram: PrimitiveValue
  hours: PrimitiveValue
}

export function MessagingHoursSection({ whatsapp, telegram, hours }: MessagingHoursSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            type="tel"
            defaultValue={whatsapp ?? ''}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="telegram_username">Telegram Username</Label>
          <Input
            id="telegram_username"
            name="telegram_username"
            defaultValue={telegram ?? ''}
            placeholder="@yoursalon"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="hours_display_text">Hours Display Text</Label>
        <Textarea
          id="hours_display_text"
          name="hours_display_text"
          defaultValue={hours ?? ''}
          placeholder="Mon-Fri: 9am - 6pm"
          rows={3}
        />
      </div>
    </div>
  )
}
