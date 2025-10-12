'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stack } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

type SeoSectionProps = {
  metaTitle: string | null
  metaDescription: string | null
}

export function SeoSection({ metaTitle, metaDescription }: SeoSectionProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <H3>SEO Metadata</H3>
          <Separator />

          <Stack gap="sm">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              name="meta_title"
              defaultValue={metaTitle ?? ''}
              placeholder="Salon name and key service keywords"
            />
            <Muted>Used for search engines and social sharing</Muted>
          </Stack>

          <Stack gap="sm">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Input
              id="meta_description"
              name="meta_description"
              defaultValue={metaDescription ?? ''}
              placeholder="Short summary that appears in search results"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
