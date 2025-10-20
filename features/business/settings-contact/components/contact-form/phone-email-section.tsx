'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stack, Grid } from '@/components/layout'
import { Separator } from '@/components/ui/separator'

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
    <Card>
      <CardContent>
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Phone & Email</h3>
          <Separator />

          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            <Stack gap="sm">
              <Label htmlFor="primary_phone">Primary Phone</Label>
              <Input
                id="primary_phone"
                name="primary_phone"
                type="tel"
                defaultValue={initialValues.primary_phone ?? ''}
                placeholder="+1 (555) 123-4567"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="secondary_phone">Secondary Phone</Label>
              <Input
                id="secondary_phone"
                name="secondary_phone"
                type="tel"
                defaultValue={initialValues.secondary_phone ?? ''}
                placeholder="+1 (555) 987-6543"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="primary_email">Primary Email</Label>
              <Input
                id="primary_email"
                name="primary_email"
                type="email"
                defaultValue={initialValues.primary_email ?? ''}
                placeholder="contact@salon.com"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="booking_email">Booking Email</Label>
              <Input
                id="booking_email"
                name="booking_email"
                type="email"
                defaultValue={initialValues.booking_email ?? ''}
                placeholder="bookings@salon.com"
              />
            </Stack>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
