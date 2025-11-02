'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { LocationAddress } from '@/features/business/locations/types'

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
        <FieldGroup className="flex flex-col gap-6">
          <Separator />

          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
              <FieldContent>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  defaultValue={address?.latitude?.toString() || ''}
                  placeholder="37.7749"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
              <FieldContent>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  defaultValue={address?.longitude?.toString() || ''}
                  placeholder="-122.4194"
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldDescription>Used for map display and location-based search.</FieldDescription>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
