'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

type SeoSectionProps = {
  metaTitle: string | null
  metaDescription: string | null
}

export function SeoSection({ metaTitle, metaDescription }: SeoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO metadata</CardTitle>
        <CardDescription>Help search engines and social previews describe your business.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="meta_title">Meta title</FieldLabel>
            <FieldContent>
              <Input
                id="meta_title"
                name="meta_title"
                defaultValue={metaTitle ?? ''}
                placeholder="Salon name and key service keywords"
              />
            </FieldContent>
            <FieldDescription>Used for search engines and social sharing.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="meta_description">Meta description</FieldLabel>
            <FieldContent>
              <Input
                id="meta_description"
                name="meta_description"
                defaultValue={metaDescription ?? ''}
                placeholder="Short summary that appears in search results"
              />
            </FieldContent>
          </Field>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
