'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type SeoSectionProps = {
  metaTitle: string | null
  metaDescription: string | null
}

export function SeoSection({ metaTitle, metaDescription }: SeoSectionProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <h3 className="scroll-m-20 text-2xl font-semibold">SEO Metadata</h3>
          <Separator />

          <div className="flex flex-col gap-3">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              name="meta_title"
              defaultValue={metaTitle ?? ''}
              placeholder="Salon name and key service keywords"
            />
            <p className="text-sm text-muted-foreground">Used for search engines and social sharing</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Input
              id="meta_description"
              name="meta_description"
              defaultValue={metaDescription ?? ''}
              placeholder="Short summary that appears in search results"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
