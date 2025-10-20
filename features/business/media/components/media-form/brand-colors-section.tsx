'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Grid, Stack } from '@/components/layout'
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
      <CardContent>
        <Stack gap="md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Brand Colors</h3>
          <Grid cols={{ base: 1, md: 3 }} gap="md">
            <div>
              <Label htmlFor="brand_primary">Primary Color</Label>
              <Input id="brand_primary" name="brand_primary" type="color" defaultValue={brandColors.primary} />
            </div>

            <div>
              <Label htmlFor="brand_secondary">Secondary Color</Label>
              <Input id="brand_secondary" name="brand_secondary" type="color" defaultValue={brandColors.secondary} />
            </div>

            <div>
              <Label htmlFor="brand_accent">Accent Color</Label>
              <Input id="brand_accent" name="brand_accent" type="color" defaultValue={brandColors.accent} />
            </div>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
