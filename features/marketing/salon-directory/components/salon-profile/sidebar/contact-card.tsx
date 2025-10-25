import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import type { Salon } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface ContactCardProps {
  salon: Salon
  location: string
}

export function ContactCard({ salon, location }: ContactCardProps) {
  if (!location && !salon['primary_phone'] && !salon['primary_email'] && !salon['website_url']) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {location && (
            <div className="flex gap-3 items-center">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">{location}</p>
            </div>
          )}
          {salon['primary_phone'] && (
            <div className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                <a href={`tel:${salon['primary_phone']}`}>{salon['primary_phone']}</a>
              </p>
            </div>
          )}
          {salon['primary_email'] && (
            <div className="flex gap-3 items-center">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                <a href={`mailto:${salon['primary_email']}`}>{salon['primary_email']}</a>
              </p>
            </div>
          )}
          {salon['website_url'] && (
            <div className="flex gap-3 items-center">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                <Link href={salon['website_url']} target="_blank" rel="noopener noreferrer">
                  Website
                </Link>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
