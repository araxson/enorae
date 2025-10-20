'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LocationAddress } from '../types'

type Props = {
  address: LocationAddress | null
}

export function LocationDetailsSection({ address }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Location Details</h3>
          <Separator />

          <Stack gap="sm">
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              defaultValue={address?.neighborhood || ''}
              placeholder="Financial District"
            />
          </Stack>

          <Stack gap="sm">
            <Label htmlFor="landmark">Nearby Landmark</Label>
            <Input
              id="landmark"
              name="landmark"
              defaultValue={address?.landmark || ''}
              placeholder="Near City Hall"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
