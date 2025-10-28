'use client'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { LocationAddress } from '@/features/business/locations/components/address-form/types'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type Props = {
  address: LocationAddress | null
}

export function StreetAddressSection({ address }: Props) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Street Address</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <FieldGroup className="flex flex-col gap-6">
          <Separator />

          <Field>
            <FieldLabel htmlFor="street_address">
              Street Address <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                id="street_address"
                name="street_address"
                required
                defaultValue={address?.street_address || ''}
                placeholder="123 Main Street"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="street_address_2">Apartment, Suite, etc.</FieldLabel>
            <FieldContent>
              <Input
                id="street_address_2"
                name="street_address_2"
                defaultValue={address?.street_address_2 || ''}
                placeholder="Suite 100"
              />
            </FieldContent>
          </Field>

          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="city">
                City <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="city"
                  name="city"
                  required
                  defaultValue={address?.city || ''}
                  placeholder="San Francisco"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="state_province">
                State/Province <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="state_province"
                  name="state_province"
                  required
                  defaultValue={address?.state_province || ''}
                  placeholder="CA"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="postal_code">
                Postal Code <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="postal_code"
                  name="postal_code"
                  required
                  defaultValue={address?.postal_code || ''}
                  placeholder="94102"
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="country_code">Country Code</FieldLabel>
            <FieldContent>
              <Input
                id="country_code"
                name="country_code"
                defaultValue={address?.country_code || 'US'}
                placeholder="US"
                maxLength={2}
              />
            </FieldContent>
            <FieldDescription>2-letter country code (e.g., US, CA, UK).</FieldDescription>
          </Field>
        </FieldGroup>
      </ItemContent>
    </Item>
  )
}
