'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div className="flex flex-col gap-6">
          <CardTitle>Phone & Email</CardTitle>
          <Separator />

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="primary_phone">Primary Phone</Label>
              <Input
                id="primary_phone"
                name="primary_phone"
                type="tel"
                defaultValue={initialValues.primary_phone ?? ''}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="secondary_phone">Secondary Phone</Label>
              <Input
                id="secondary_phone"
                name="secondary_phone"
                type="tel"
                defaultValue={initialValues.secondary_phone ?? ''}
                placeholder="+1 (555) 987-6543"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="primary_email">Primary Email</Label>
              <Input
                id="primary_email"
                name="primary_email"
                type="email"
                defaultValue={initialValues.primary_email ?? ''}
                placeholder="contact@salon.com"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="booking_email">Booking Email</Label>
              <Input
                id="booking_email"
                name="booking_email"
                type="email"
                defaultValue={initialValues.booking_email ?? ''}
                placeholder="bookings@salon.com"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
