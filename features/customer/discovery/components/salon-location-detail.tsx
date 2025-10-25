import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    if (locationAddress['latitude'] && locationAddress['longitude']) {
      return `https://www.google.com/maps/search/?api=1&query=${locationAddress['latitude']},${locationAddress['longitude']}`
    } else if (locationAddress['formatted_address']) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress['formatted_address'])}`
    }
    return null
  }

  const googleMapsUrl = getGoogleMapsUrl()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <CardTitle>Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Formatted Address */}
          {locationAddress['formatted_address'] && (
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Address</p>
              <p className="whitespace-pre-line text-sm text-foreground">
                {locationAddress['formatted_address']}
              </p>
            </div>
          )}

          {/* Individual Address Components */}
          {!locationAddress['formatted_address'] && (
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Address</p>
              <div className="flex flex-col gap-2">
                {locationAddress['street_address'] && <p className="text-sm text-foreground">{locationAddress['street_address']}</p>}
                {locationAddress['street_address_2'] && <p className="text-sm text-foreground">{locationAddress['street_address_2']}</p>}
                <p className="text-sm text-foreground">
                  {locationAddress['city']}
                  {locationAddress['state_province'] && `, ${locationAddress['state_province']}`}
                  {locationAddress['postal_code'] && ` ${locationAddress['postal_code']}`}
                </p>
                {locationAddress['country_code'] && <p className="text-sm text-foreground">{locationAddress['country_code']}</p>}
              </div>
            </div>
          )}

          {/* Neighborhood & Landmark */}
          {(locationAddress['neighborhood'] || locationAddress['landmark']) && (
            <>
              <Separator />
              <div>
                {locationAddress['neighborhood'] && (
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground">Neighborhood</span>
                    <p className="text-sm text-foreground">{locationAddress['neighborhood']}</p>
                  </div>
                )}
                {locationAddress['landmark'] && (
                  <div>
                    <span className="text-xs text-muted-foreground">Nearby Landmark</span>
                    <p className="text-sm text-foreground">{locationAddress['landmark']}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Parking Instructions */}
          {locationAddress['parking_instructions'] && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ParkingCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Parking Information</span>
                </div>
                <p className="whitespace-pre-line text-sm text-foreground">
                  {locationAddress['parking_instructions']}
                </p>
              </div>
            </>
          )}

          {/* Accessibility Notes */}
          {locationAddress['accessibility_notes'] && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Accessibility className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Accessibility</span>
                </div>
                <p className="whitespace-pre-line text-sm text-foreground">
                  {locationAddress['accessibility_notes']}
                </p>
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
          {locationAddress['latitude'] && locationAddress['longitude'] && (
            <p className="text-center text-xs text-muted-foreground">
              {locationAddress['latitude']}, {locationAddress['longitude']}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
