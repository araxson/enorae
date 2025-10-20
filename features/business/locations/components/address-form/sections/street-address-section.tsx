'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Grid, Stack } from '@/components/layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LocationAddress } from '../types'

type Props = {
  address: LocationAddress | null
}

export function StreetAddressSection({ address }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Street Address</h3>
          <Separator />

          <Stack gap="sm">
            <Label htmlFor="street_address">
              Street Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="street_address"
              name="street_address"
              required
              defaultValue={address?.street_address || ''}
              placeholder="123 Main Street"
            />
          </Stack>

          <Stack gap="sm">
            <Label htmlFor="street_address_2">Apartment, Suite, etc.</Label>
            <Input
              id="street_address_2"
              name="street_address_2"
              defaultValue={address?.street_address_2 || ''}
              placeholder="Suite 100"
            />
          </Stack>

          <Grid cols={{ base: 1, md: 3 }} gap="lg">
            <Stack gap="sm">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                required
                defaultValue={address?.city || ''}
                placeholder="San Francisco"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="state_province">
                State/Province <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state_province"
                name="state_province"
                required
                defaultValue={address?.state_province || ''}
                placeholder="CA"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="postal_code">
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postal_code"
                name="postal_code"
                required
                defaultValue={address?.postal_code || ''}
                placeholder="94102"
              />
            </Stack>
          </Grid>

          <Stack gap="sm">
            <Label htmlFor="country_code">Country Code</Label>
            <Input
              id="country_code"
              name="country_code"
              defaultValue={address?.country_code || 'US'}
              placeholder="US"
              maxLength={2}
            />
            <p className="text-sm text-muted-foreground">2-letter country code (e.g., US, CA, UK)</p>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
