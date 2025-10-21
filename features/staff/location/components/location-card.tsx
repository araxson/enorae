import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, ExternalLink, Clock } from 'lucide-react'
import type { StaffLocationDetail } from '../types'

interface LocationCardProps {
  location: StaffLocationDetail
  showOperatingHours?: boolean
}

export function LocationCard({ location, showOperatingHours = true }: LocationCardProps) {
  const address = [
    location.address_line1,
    location.address_line2,
    location.city,
    location.state_province,
    location.postal_code,
    location.country_code,
  ].filter(Boolean).join(', ')

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <Card>
      <CardHeader className="p-6 pb-4">
        <div className="flex gap-4 items-start justify-between">
          <div className="flex-1">
            <div className="flex gap-3 items-center flex-wrap">
              <CardTitle>{location.location_name || location.name}</CardTitle>
              {location.is_primary && <Badge variant="default">Primary</Badge>}
              {location.is_active === false && <Badge variant="secondary">Inactive</Badge>}
            </div>
            {location.salon_name && <CardDescription>{location.salon_name}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex flex-col gap-3">
          {address && (
            <div className="flex gap-3 items-start">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{address}</p>
            </div>
          )}

          {location.phone_number && (
            <div className="flex gap-3 items-center">
              <Phone className="h-4 w-4" />
              <p className="text-sm">{location.phone_number}</p>
            </div>
          )}

          {location.email && (
            <div className="flex gap-3 items-center">
              <Mail className="h-4 w-4" />
              <p className="text-sm">{location.email}</p>
            </div>
          )}

          {location.accessibility_notes && (
            <div className="border-t pt-3">
              <p className="text-sm text-muted-foreground">
                <strong>Accessibility:</strong> {location.accessibility_notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Get Directions
            </a>
          </Button>
          {location.phone_number && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${location.phone_number}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
