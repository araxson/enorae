'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type SeoSectionProps = {
  metaTitle: string | null
  metaDescription: string | null
}

export function SeoSection({ metaTitle, metaDescription }: SeoSectionProps) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>SEO metadata</ItemTitle>
          <ItemDescription>
            Help search engines and social previews describe your business.
          </ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
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
      </ItemContent>
    </Item>
  )
}
