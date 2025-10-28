import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Item, ItemContent, ItemDescription, ItemTitle, ItemMedia } from '@/components/ui/item'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import type { Salon } from '../types'

interface ContactCardProps {
  salon: Salon
  location: string
}

export function ContactCard({ salon, location }: ContactCardProps) {
  if (!location && !salon['primary_phone'] && !salon['primary_email'] && !salon['website_url']) {
    return null
  }

  const mapsHref = location
    ? `https://www.google.com/maps/search/${encodeURIComponent(location)}`
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="group/item-group flex flex-col gap-3"
          data-slot="item-group"
          role="list"
        >
          {location && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <MapPin className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Location</ItemTitle>
                <ItemDescription>
                  {mapsHref ? (
                    <Link href={mapsHref} target="_blank" rel="noopener noreferrer">
                      {location}
                    </Link>
                  ) : (
                    location
                  )}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon['primary_phone'] && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Phone className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Phone</ItemTitle>
                <ItemDescription>
                  <a href={`tel:${salon['primary_phone']}`}>{salon['primary_phone']}</a>
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon['primary_email'] && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Mail className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Email</ItemTitle>
                <ItemDescription>
                  <a href={`mailto:${salon['primary_email']}`}>{salon['primary_email']}</a>
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
          {salon['website_url'] && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Globe className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Website</ItemTitle>
                <ItemDescription>
                  <Link href={salon['website_url']} target="_blank" rel="noopener noreferrer">
                    Visit site
                  </Link>
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
