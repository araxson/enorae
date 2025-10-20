import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack, Group } from '@/components/layout'
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
        <Stack gap="md">
          {location && (
            <Group gap="sm">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">{location}</p>
            </Group>
          )}
          {salon.phone && (
            <Group gap="sm">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">
                <a href={`tel:${salon.phone}`}>{salon.phone}</a>
              </p>
            </Group>
          )}
          {salon.email && (
            <Group gap="sm">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">
                <a href={`mailto:${salon.email}`}>{salon.email}</a>
              </p>
            </Group>
          )}
          {salon.website_url && (
            <Group gap="sm">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground text-sm">
                <Link href={salon.website_url} target="_blank" rel="noopener noreferrer">
                  Website
                </Link>
              </p>
            </Group>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
