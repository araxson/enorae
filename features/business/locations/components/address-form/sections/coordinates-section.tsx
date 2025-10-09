'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Grid, Stack } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LocationAddress } from '../types'

type Props = {
  address: LocationAddress | null
}

export function CoordinatesSection({ address }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <H3>Coordinates (Optional)</H3>
          <Separator />

          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            <Stack gap="sm">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                defaultValue={address?.latitude?.toString() || ''}
                placeholder="37.7749"
              />
            </Stack>

            <Stack gap="sm">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                defaultValue={address?.longitude?.toString() || ''}
                placeholder="-122.4194"
              />
            </Stack>
          </Grid>

          <Muted>Used for map display and location-based search</Muted>
        </Stack>
      </CardContent>
    </Card>
  )
}
