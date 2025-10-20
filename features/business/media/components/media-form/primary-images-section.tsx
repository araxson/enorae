'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                type="url"
                defaultValue={logoUrl}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-muted-foreground">Your salon&apos;s logo (square format recommended)</p>
            </div>

            <div>
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                name="cover_image_url"
                type="url"
                defaultValue={coverImageUrl}
                placeholder="https://example.com/cover.jpg"
              />
              <p className="text-sm text-muted-foreground">Hero image for your salon page (16:9 recommended)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
