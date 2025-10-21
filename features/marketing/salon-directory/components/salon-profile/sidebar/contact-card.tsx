import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import type { Salon } from '../types'

interface ContactCardProps {
  salon: Salon
  location: string
}

export function ContactCard({ salon, location }: ContactCardProps) {
  if (!location && !salon.phone && !salon.email && !salon.website_url) {
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
              <p className="text-sm text-muted-foreground text-sm">{location}</p>
            </div>
          )}
          {salon.phone && (
            <div className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">
                <a href={`tel:${salon.phone}`}>{salon.phone}</a>
              </p>
            </div>
          )}
          {salon.email && (
            <div className="flex gap-3 items-center">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">
                <a href={`mailto:${salon.email}`}>{salon.email}</a>
              </p>
            </div>
          )}
          {salon.website_url && (
            <div className="flex gap-3 items-center">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">
                <Link href={salon.website_url} target="_blank" rel="noopener noreferrer">
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
