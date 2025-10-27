'use client'

import { Switch } from '@/components/ui/switch'
import { Field, FieldContent, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'

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
    <FieldSet className="space-y-3">
      <FieldLegend>Settings</FieldLegend>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel htmlFor="isActive" className="cursor-pointer">
          Active
        </FieldLabel>
        <FieldContent className="flex justify-end">
          <Switch id="isActive" checked={isActive} onCheckedChange={onActiveChange} />
        </FieldContent>
      </Field>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel htmlFor="isBookable" className="cursor-pointer">
          Bookable online
        </FieldLabel>
        <FieldContent className="flex justify-end">
          <Switch id="isBookable" checked={isBookable} onCheckedChange={onBookableChange} />
        </FieldContent>
      </Field>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel htmlFor="isFeatured" className="cursor-pointer">
          Featured service
        </FieldLabel>
        <FieldContent className="flex justify-end">
          <Switch id="isFeatured" checked={isFeatured} onCheckedChange={onFeaturedChange} />
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
