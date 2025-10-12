'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stack, Grid } from '@/components/layout'
import { H3 } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

type PrimitiveValue = string | null | undefined

type WebsiteBookingSectionProps = {
  initialValues: {
    website_url: PrimitiveValue
    booking_url: PrimitiveValue
  }
}

export function WebsiteBookingSection({ initialValues }: WebsiteBookingSectionProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <H3>Website & Booking</H3>
          <Separator />

          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            <Stack gap="sm">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                defaultValue={initialValues.website_url ?? ''}
                placeholder="https://www.yoursalon.com"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="booking_url">Booking URL</Label>
              <Input
                id="booking_url"
                name="booking_url"
                type="url"
                defaultValue={initialValues.booking_url ?? ''}
                placeholder="https://book.yoursalon.com"
              />
            </Stack>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
