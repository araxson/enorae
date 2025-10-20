import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
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
    <Card className="p-6">
      <Stack gap="md">
        <Flex align="start" justify="between">
          <div className="flex-1">
            <Flex align="center" gap="sm">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{location.location_name || location.name}</h3>
              {location.is_primary && (
                <Badge variant="default">Primary</Badge>
              )}
              {location.is_active === false && (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </Flex>
            {location.salon_name && (
              <p className="text-sm text-muted-foreground">{location.salon_name}</p>
            )}
          </div>
        </Flex>

        <Stack gap="sm">
          {address && (
            <Flex align="start" gap="sm">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="leading-7 text-sm">{address}</p>
            </Flex>
          )}

          {location.phone_number && (
            <Flex align="center" gap="sm">
              <Phone className="h-4 w-4" />
              <p className="leading-7 text-sm">{location.phone_number}</p>
            </Flex>
          )}

          {location.email && (
            <Flex align="center" gap="sm">
              <Mail className="h-4 w-4" />
              <p className="leading-7 text-sm">{location.email}</p>
            </Flex>
          )}
        </Stack>

        {location.accessibility_notes && (
          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground text-xs">
              <strong>Accessibility:</strong> {location.accessibility_notes}
            </p>
          </div>
        )}

        <Flex gap="sm">
          <Button variant="outline" size="sm" asChild>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Get Directions
            </a>
          </Button>
          {location.phone_number && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${location.phone_number}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          )}
        </Flex>
      </Stack>
    </Card>
  )
}
