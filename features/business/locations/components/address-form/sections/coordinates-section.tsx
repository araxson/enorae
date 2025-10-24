'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'

type Props = {
  address: LocationAddress | null
}

export function CoordinatesSection({ address }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinates (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <Separator />

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                defaultValue={address?.latitude?.toString() || ''}
                placeholder="37.7749"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                defaultValue={address?.longitude?.toString() || ''}
                placeholder="-122.4194"
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Used for map display and location-based search</p>
        </div>
      </CardContent>
    </Card>
  )
}
