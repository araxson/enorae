import { Phone, Mail, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils";

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
    <div className={cn('flex flex-col gap-3', className)}>
      {phone && (
        <div className="flex gap-3 items-center">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${phone}`} className="hover:underline">
            <small className="text-sm font-medium leading-none">{phone}</small>
          </a>
        </div>
      )}
      {email && (
        <div className="flex gap-3 items-center">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="hover:underline">
            <small className="text-sm font-medium leading-none">{email}</small>
          </a>
        </div>
      )}
      {websiteUrl && (
        <div className="flex gap-3 items-center">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            <small className="text-sm font-medium leading-none">Visit Website</small>
          </a>
        </div>
      )}
    </div>
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
    <div className={cn('flex gap-3 items-center', className)}>
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
    </div>
  )
}
