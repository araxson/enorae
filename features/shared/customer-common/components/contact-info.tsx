import { Phone, Mail, Globe } from 'lucide-react'
import { Stack, Group } from '@/components/layout'
import { Small } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

interface ContactInfoProps {
  phone?: string | null
  email?: string | null
  websiteUrl?: string | null
  className?: string
}

export function ContactInfo({ phone, email, websiteUrl, className }: ContactInfoProps) {
  const hasContact = phone || email || websiteUrl

  if (!hasContact) {
    return null
  }

  return (
    <Stack gap="sm" className={className}>
      {phone && (
        <Group gap="sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${phone}`} className="hover:underline">
            <Small>{phone}</Small>
          </a>
        </Group>
      )}
      {email && (
        <Group gap="sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="hover:underline">
            <Small>{email}</Small>
          </a>
        </Group>
      )}
      {websiteUrl && (
        <Group gap="sm">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            <Small>Visit Website</Small>
          </a>
        </Group>
      )}
    </Stack>
  )
}

interface ContactButtonsProps {
  phone?: string | null
  email?: string | null
  websiteUrl?: string | null
  className?: string
}

export function ContactButtons({ phone, email, websiteUrl, className }: ContactButtonsProps) {
  const hasContact = phone || email || websiteUrl

  if (!hasContact) {
    return null
  }

  return (
    <Group gap="sm" className={className}>
      {phone && (
        <Button variant="outline" size="sm" asChild>
          <a href={`tel:${phone}`}>
            <Phone className="mr-2 h-4 w-4" />
            Call
          </a>
        </Button>
      )}
      {email && (
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${email}`}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </a>
        </Button>
      )}
      {websiteUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
            <Globe className="mr-2 h-4 w-4" />
            Website
          </a>
        </Button>
      )}
    </Group>
  )
}
