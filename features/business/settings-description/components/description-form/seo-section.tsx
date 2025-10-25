'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="meta_title">Meta title</Label>
          <Input
            id="meta_title"
            name="meta_title"
            defaultValue={metaTitle ?? ''}
            placeholder="Salon name and key service keywords"
          />
          <p className="text-muted-foreground">Used for search engines and social sharing.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="meta_description">Meta description</Label>
          <Input
            id="meta_description"
            name="meta_description"
            defaultValue={metaDescription ?? ''}
            placeholder="Short summary that appears in search results"
          />
        </div>
      </CardContent>
    </Card>
  )
}
