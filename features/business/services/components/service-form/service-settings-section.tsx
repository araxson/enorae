'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ServiceSettingsSectionProps {
  isActive: boolean
  isBookable: boolean
  isFeatured: boolean
  onActiveChange: (value: boolean) => void
  onBookableChange: (value: boolean) => void
  onFeaturedChange: (value: boolean) => void
}

export function ServiceSettingsSection({
  isActive,
  isBookable,
  isFeatured,
  onActiveChange,
  onBookableChange,
  onFeaturedChange,
}: ServiceSettingsSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-medium">Settings</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive" className="cursor-pointer">
            Active
          </Label>
          <Switch id="isActive" checked={isActive} onCheckedChange={onActiveChange} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isBookable" className="cursor-pointer">
            Bookable Online
          </Label>
          <Switch id="isBookable" checked={isBookable} onCheckedChange={onBookableChange} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isFeatured" className="cursor-pointer">
            Featured Service
          </Label>
          <Switch id="isFeatured" checked={isFeatured} onCheckedChange={onFeaturedChange} />
        </div>
      </div>
    </section>
  )
}
