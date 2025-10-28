'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
type SocialLinks = {
  facebook: string
  instagram: string
  twitter: string
  tiktok: string
  website: string
}

type SocialLinksSectionProps = {
  socialLinks: SocialLinks
}

const SOCIAL_INPUTS: Array<{ id: keyof SocialLinks; label: string; placeholder: string }> = [
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yoursalon' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yoursalon' },
  { id: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yoursalon' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yoursalon' },
  { id: 'website', label: 'Website', placeholder: 'https://yoursalon.com' },
]

export function SocialLinksSection({ socialLinks }: SocialLinksSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldSet className="flex flex-col gap-6">
          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SOCIAL_INPUTS.map(({ id, label, placeholder }) => (
              <Field key={id}>
                <FieldLabel htmlFor={`social_${id}`}>{label}</FieldLabel>
                <FieldContent>
                  <Input
                    id={`social_${id}`}
                    name={`social_${id}`}
                    type="url"
                    defaultValue={socialLinks[id] || ''}
                    placeholder={placeholder}
                  />
                </FieldContent>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
