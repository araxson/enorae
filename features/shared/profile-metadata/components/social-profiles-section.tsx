'use client'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { SOCIAL_PROFILE_FIELDS, type SocialProfileKey } from './constants'

type SocialProfilesSectionProps = {
  defaults: Partial<Record<SocialProfileKey, string>>
}

export function SocialProfilesSection({ defaults }: SocialProfilesSectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {SOCIAL_PROFILE_FIELDS.map((field) => (
        <Field key={field.key}>
          <FieldLabel htmlFor={`social_${field.key}`}>{field.label}</FieldLabel>
          <FieldContent>
            <Input
              id={`social_${field.key}`}
              name={`social_${field.key}`}
              type="url"
              defaultValue={defaults[field.key] || ''}
              placeholder={field.placeholder}
            />
          </FieldContent>
        </Field>
      ))}
    </div>
  )
}
