'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type Props = {
  address: LocationAddress | null
}

export function AdditionalInfoSection({ address }: Props) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Additional Information</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <FieldGroup className="flex flex-col gap-6">
          <Separator />

          <Field>
            <FieldLabel htmlFor="parking_instructions">Parking Instructions</FieldLabel>
            <FieldContent>
              <Textarea
                id="parking_instructions"
                name="parking_instructions"
                defaultValue={address?.parking_instructions || ''}
                placeholder="Street parking available. Parking garage entrance on Oak Street."
                rows={3}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="accessibility_notes">Accessibility Notes</FieldLabel>
            <FieldContent>
              <Textarea
                id="accessibility_notes"
                name="accessibility_notes"
                defaultValue={address?.accessibility_notes || ''}
                placeholder="Wheelchair accessible entrance on Main Street. Elevator available."
                rows={3}
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
