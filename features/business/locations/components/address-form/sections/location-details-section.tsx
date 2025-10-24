'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'

type Props = {
  address: LocationAddress | null
}

export function LocationDetailsSection({ address }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <Separator />

          <div className="flex flex-col gap-3">
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              defaultValue={address?.neighborhood || ''}
              placeholder="Financial District"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="landmark">Nearby Landmark</Label>
            <Input
              id="landmark"
              name="landmark"
              defaultValue={address?.landmark || ''}
              placeholder="Near City Hall"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
