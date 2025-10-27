'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type PrimitiveValue = string | null | undefined

type WebsiteBookingSectionProps = {
  initialValues: {
    website_url: PrimitiveValue
    booking_url: PrimitiveValue
  }
}

export function WebsiteBookingSection({ initialValues }: WebsiteBookingSectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          defaultValue={initialValues.website_url ?? ''}
          placeholder="https://www.yoursalon.com"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="booking_url">Booking URL</Label>
        <Input
          id="booking_url"
          name="booking_url"
          type="url"
          defaultValue={initialValues.booking_url ?? ''}
          placeholder="https://book.yoursalon.com"
        />
      </div>
    </div>
  )
}
