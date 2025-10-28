'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
type PrimaryImagesSectionProps = {
  logoUrl: string
  coverImageUrl: string
}

export function PrimaryImagesSection({ logoUrl, coverImageUrl }: PrimaryImagesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary Images</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldSet className="flex flex-col gap-6">
          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="logo_url">Logo URL</FieldLabel>
              <FieldContent>
                <Input
                  id="logo_url"
                  name="logo_url"
                  type="url"
                  defaultValue={logoUrl}
                  placeholder="https://example.com/logo.png"
                />
              </FieldContent>
              <FieldDescription>Your salon&apos;s logo (square format recommended).</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="cover_image_url">Cover Image URL</FieldLabel>
              <FieldContent>
                <Input
                  id="cover_image_url"
                  name="cover_image_url"
                  type="url"
                  defaultValue={coverImageUrl}
                  placeholder="https://example.com/cover.jpg"
                />
              </FieldContent>
              <FieldDescription>Hero image for your salon page (16:9 recommended).</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
