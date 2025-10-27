'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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
        <FieldGroup className="flex flex-col gap-6">
          <Separator />

          <Field>
            <FieldLabel htmlFor="neighborhood">Neighborhood</FieldLabel>
            <FieldContent>
              <Input
                id="neighborhood"
                name="neighborhood"
                defaultValue={address?.neighborhood || ''}
                placeholder="Financial District"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="landmark">Nearby Landmark</FieldLabel>
            <FieldContent>
              <Input
                id="landmark"
                name="landmark"
                defaultValue={address?.landmark || ''}
                placeholder="Near City Hall"
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
