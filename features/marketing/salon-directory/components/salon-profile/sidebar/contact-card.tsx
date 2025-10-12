import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack, Group } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
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
              <Muted className="text-sm">{location}</Muted>
            </Group>
          )}
          {salon.phone && (
            <Group gap="sm">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <Muted className="text-sm">
                <a href={`tel:${salon.phone}`}>{salon.phone}</a>
              </Muted>
            </Group>
          )}
          {salon.email && (
            <Group gap="sm">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <Muted className="text-sm">
                <a href={`mailto:${salon.email}`}>{salon.email}</a>
              </Muted>
            </Group>
          )}
          {salon.website_url && (
            <Group gap="sm">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
              <Muted className="text-sm">
                <Link href={salon.website_url} target="_blank" rel="noopener noreferrer">
                  Website
                </Link>
              </Muted>
            </Group>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
