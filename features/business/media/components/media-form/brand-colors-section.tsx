'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
