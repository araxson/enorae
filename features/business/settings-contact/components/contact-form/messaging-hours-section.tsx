'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Stack, Grid } from '@/components/layout'
import { Separator } from '@/components/ui/separator'

type PrimitiveValue = string | null | undefined

type MessagingHoursSectionProps = {
  whatsapp: PrimitiveValue
  telegram: PrimitiveValue
  hours: PrimitiveValue
}

export function MessagingHoursSection({ whatsapp, telegram, hours }: MessagingHoursSectionProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Messaging & Hours</h3>
          <Separator />

          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            <Stack gap="sm">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                defaultValue={whatsapp ?? ''}
                placeholder="+1 (555) 123-4567"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="telegram_username">Telegram Username</Label>
              <Input
                id="telegram_username"
                name="telegram_username"
                defaultValue={telegram ?? ''}
                placeholder="@yoursalon"
              />
            </Stack>
          </Grid>

          <Stack gap="sm">
            <Label htmlFor="hours_display_text">Hours Display Text</Label>
            <Textarea
              id="hours_display_text"
              name="hours_display_text"
              defaultValue={hours ?? ''}
              placeholder="Mon-Fri: 9am - 6pm"
              rows={3}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
