'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type PrimitiveValue = string | null | undefined

type SocialLinks = {
  facebook_url: PrimitiveValue
  instagram_url: PrimitiveValue
  twitter_url: PrimitiveValue
  tiktok_url: PrimitiveValue
  linkedin_url: PrimitiveValue
  youtube_url: PrimitiveValue
}

type SocialLinksSectionProps = {
  initialValues: SocialLinks
}

const SOCIAL_FIELDS: Array<{ id: keyof SocialLinks; label: string; placeholder: string }> = [
  { id: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/yoursalon' },
  { id: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/yoursalon' },
  { id: 'twitter_url', label: 'Twitter', placeholder: 'https://twitter.com/yoursalon' },
  { id: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@yoursalon' },
  { id: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yoursalon' },
  { id: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@yoursalon' },
]

export function SocialLinksSection({ initialValues }: SocialLinksSectionProps) {
  return (
    <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {SOCIAL_FIELDS.map(({ id, label, placeholder }) => (
        <Field key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <FieldContent>
            <Input
              id={id}
              name={id}
              type="url"
              defaultValue={initialValues[id] ?? ''}
              placeholder={placeholder}
            />
          </FieldContent>
        </Field>
      ))}
    </FieldGroup>
  )
}
