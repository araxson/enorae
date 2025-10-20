'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stack, Grid } from '@/components/layout'
type PrimaryImagesSectionProps = {
  logoUrl: string
  coverImageUrl: string
}

export function PrimaryImagesSection({ logoUrl, coverImageUrl }: PrimaryImagesSectionProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap="md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Primary Images</h3>
          <Grid cols={{ base: 1, md: 2 }} gap="md">
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
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
