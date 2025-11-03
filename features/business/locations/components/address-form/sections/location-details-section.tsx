'use client'

import { UseFormReturn } from 'react-hook-form'
import { AddressSchema } from '@/features/business/locations/api/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type Props = {
  form: UseFormReturn<AddressSchema>
}

export function LocationDetailsSection({ form }: Props) {
  // Note: This section doesn't use form fields yet - it's informational only
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
                defaultValue=""
                placeholder="Financial District"
                disabled
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="landmark">Nearby Landmark</FieldLabel>
            <FieldContent>
              <Input
                id="landmark"
                name="landmark"
                defaultValue=""
                placeholder="Near City Hall"
                disabled
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
