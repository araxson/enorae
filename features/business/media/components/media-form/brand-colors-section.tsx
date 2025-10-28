'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
type BrandColors = {
  primary: string
  secondary: string
  accent: string
}

type BrandColorsSectionProps = {
  brandColors: BrandColors
}

export function BrandColorsSection({ brandColors }: BrandColorsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Colors</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldSet className="flex flex-col gap-6">
          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="brand_primary">Primary Color</FieldLabel>
              <FieldContent>
                <Input id="brand_primary" name="brand_primary" type="color" defaultValue={brandColors.primary} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="brand_secondary">Secondary Color</FieldLabel>
              <FieldContent>
                <Input id="brand_secondary" name="brand_secondary" type="color" defaultValue={brandColors.secondary} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="brand_accent">Accent Color</FieldLabel>
              <FieldContent>
                <Input id="brand_accent" name="brand_accent" type="color" defaultValue={brandColors.accent} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
