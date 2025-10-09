'use client'

import { Grid, Stack } from '@/components/layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { SOCIAL_PROFILE_FIELDS, type SocialProfileKey } from './constants'

type SocialProfilesSectionProps = {
  defaults: Partial<Record<SocialProfileKey, string>>
}

export function SocialProfilesSection({ defaults }: SocialProfilesSectionProps) {
  return (
    <Grid cols={{ base: 1, md: 2 }} gap="lg">
      {SOCIAL_PROFILE_FIELDS.map((field) => (
        <Stack key={field.key} gap="sm">
          <Label htmlFor={`social_${field.key}`}>{field.label}</Label>
          <Input
            id={`social_${field.key}`}
            name={`social_${field.key}`}
            type="url"
            defaultValue={defaults[field.key] || ''}
            placeholder={field.placeholder}
          />
        </Stack>
      ))}
    </Grid>
  )
}
