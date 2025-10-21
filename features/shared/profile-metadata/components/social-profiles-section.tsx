'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { SOCIAL_PROFILE_FIELDS, type SocialProfileKey } from './constants'

type SocialProfilesSectionProps = {
  defaults: Partial<Record<SocialProfileKey, string>>
}

export function SocialProfilesSection({ defaults }: SocialProfilesSectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {SOCIAL_PROFILE_FIELDS.map((field) => (
        <div key={field.key} className="flex flex-col gap-3">
          <Label htmlFor={`social_${field.key}`}>{field.label}</Label>
          <Input
            id={`social_${field.key}`}
            name={`social_${field.key}`}
            type="url"
            defaultValue={defaults[field.key] || ''}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>
  )
}
