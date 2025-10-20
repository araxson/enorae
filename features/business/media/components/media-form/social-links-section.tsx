'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Grid, Stack } from '@/components/layout'
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
      <CardContent>
        <Stack gap="md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Social Media Links</h3>
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {SOCIAL_INPUTS.map(({ id, label, placeholder }) => (
              <div key={id}>
                <Label htmlFor={`social_${id}`}>{label}</Label>
                <Input
                  id={`social_${id}`}
                  name={`social_${id}`}
                  type="url"
                  defaultValue={socialLinks[id] || ''}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
