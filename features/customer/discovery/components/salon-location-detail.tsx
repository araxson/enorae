import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { MapPin, Navigation, ParkingCircle, Accessibility } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type LocationAddress = Database['public']['Views']['location_addresses']['Row']

interface SalonLocationDetailProps {
  locationAddress: LocationAddress
}

export function SalonLocationDetail({ locationAddress }: SalonLocationDetailProps) {
  // Build Google Maps URL
  const getGoogleMapsUrl = () => {
    if (locationAddress.latitude && locationAddress.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${locationAddress.latitude},${locationAddress.longitude}`
    } else if (locationAddress.formatted_address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress.formatted_address)}`
    }
    return null
  }

  const googleMapsUrl = getGoogleMapsUrl()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {/* Formatted Address */}
          {locationAddress.formatted_address && (
            <div>
              <Muted className="mb-2 block text-xs">Address</Muted>
              <P className="whitespace-pre-line">{locationAddress.formatted_address}</P>
            </div>
          )}

          {/* Individual Address Components */}
          {!locationAddress.formatted_address && (
            <div>
              <Muted className="mb-2 block text-xs">Address</Muted>
              <Stack gap="xs">
                {locationAddress.street_address && <P>{locationAddress.street_address}</P>}
                {locationAddress.street_address_2 && <P>{locationAddress.street_address_2}</P>}
                <P>
                  {locationAddress.city}
                  {locationAddress.state_province && `, ${locationAddress.state_province}`}
                  {locationAddress.postal_code && ` ${locationAddress.postal_code}`}
                </P>
                {locationAddress.country_code && <P>{locationAddress.country_code}</P>}
              </Stack>
            </div>
          )}

          {/* Neighborhood & Landmark */}
          {(locationAddress.neighborhood || locationAddress.landmark) && (
            <>
              <Separator />
              <div>
                {locationAddress.neighborhood && (
                  <div className="mb-2">
                    <Muted className="text-xs">Neighborhood</Muted>
                    <P className="text-sm">{locationAddress.neighborhood}</P>
                  </div>
                )}
                {locationAddress.landmark && (
                  <div>
                    <Muted className="text-xs">Nearby Landmark</Muted>
                    <P className="text-sm">{locationAddress.landmark}</P>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Parking Instructions */}
          {locationAddress.parking_instructions && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ParkingCircle className="h-4 w-4 text-muted-foreground" />
                  <Muted className="text-xs">Parking Information</Muted>
                </div>
                <P className="text-sm whitespace-pre-line">{locationAddress.parking_instructions}</P>
              </div>
            </>
          )}

          {/* Accessibility Notes */}
          {locationAddress.accessibility_notes && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Accessibility className="h-4 w-4 text-muted-foreground" />
                  <Muted className="text-xs">Accessibility</Muted>
                </div>
                <P className="text-sm whitespace-pre-line">{locationAddress.accessibility_notes}</P>
              </div>
            </>
          )}

          {/* Directions Button */}
          {googleMapsUrl && (
            <>
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </>
          )}

          {/* Coordinates (for debugging/advanced users) */}
          {locationAddress.latitude && locationAddress.longitude && (
            <Muted className="text-xs text-center">
              {locationAddress.latitude}, {locationAddress.longitude}
            </Muted>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
