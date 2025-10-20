'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stack, Grid } from '@/components/layout'
import { Separator } from '@/components/ui/separator'

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
    <Card>
      <CardContent>
        <Stack gap="lg">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Social Media Links</h3>
          <Separator />

          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            {SOCIAL_FIELDS.map(({ id, label, placeholder }) => (
              <Stack gap="sm" key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  name={id}
                  type="url"
                  defaultValue={initialValues[id] ?? ''}
                  placeholder={placeholder}
                />
              </Stack>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
