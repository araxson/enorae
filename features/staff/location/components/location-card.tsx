import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import type { StaffLocationDetail } from '@/features/staff/location/types'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

interface LocationCardProps {
  location: StaffLocationDetail
  showOperatingHours?: boolean
}

export function LocationCard({ location, showOperatingHours = true }: LocationCardProps) {
  const address = [
    location.address_line1,
    location.address_line2,
    location['city'],
    location['state_province'],
    location['postal_code'],
    location['country_code'],
  ].filter(Boolean).join(', ')

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <Card>
      <CardHeader>
        <div className="p-6 pb-4">
          <div className="flex gap-4 items-start justify-between">
            <div className="flex-1">
              <div className="flex gap-3 items-center flex-wrap">
                <CardTitle>{location.location_name || location['name']}</CardTitle>
                {location['is_primary'] && <Badge variant="default">Primary</Badge>}
                {location['is_active'] === false && <Badge variant="secondary">Inactive</Badge>}
              </div>
              {location['salon_name'] && <CardDescription>{location['salon_name']}</CardDescription>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-6 pt-0 space-y-3">
          <ItemGroup className="space-y-3">
            {address ? (
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{address}</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}

            {location.phone_number ? (
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{location.phone_number}</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}

            {location['email'] ? (
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{location['email']}</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}
          </ItemGroup>

          {location['accessibility_notes'] ? (
            <>
              <Separator />
              <div className="pt-3 space-y-2">
                <Badge variant="outline">Accessibility</Badge>
                <CardDescription>{location['accessibility_notes']}</CardDescription>
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        <div className="p-6 pt-0">
          <ButtonGroup>
            <Button variant="outline" size="sm" asChild>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Get Directions
              </a>
            </Button>
            {location.phone_number ? (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${location.phone_number}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </a>
              </Button>
            ) : null}
          </ButtonGroup>
        </div>
      </CardFooter>
    </Card>
  )
}
