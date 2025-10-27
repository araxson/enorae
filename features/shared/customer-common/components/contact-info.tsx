import { Phone, Mail, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

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
    <ItemGroup className={cn('flex flex-col gap-3', className)}>
      {phone && (
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <a href={`tel:${phone}`} className="hover:underline">
                {phone}
              </a>
            </ItemTitle>
          </ItemContent>
        </Item>
      )}
      {email && (
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </ItemTitle>
          </ItemContent>
        </Item>
      )}
      {websiteUrl && (
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Visit Website
              </a>
            </ItemTitle>
            <ItemDescription>Opens in a new tab</ItemDescription>
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
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
    <ButtonGroup className={cn('flex flex-wrap gap-3', className)}>
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
    </ButtonGroup>
  )
}
