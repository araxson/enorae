import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { MapPin, Navigation, ParkingCircle, Accessibility } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type LocationAddress = Database['public']['Views']['location_addresses_view']['Row']

interface SalonLocationDetailProps {
  locationAddress: LocationAddress
}

export function SalonLocationDetail({ locationAddress }: SalonLocationDetailProps) {
  const getGoogleMapsUrl = () => {
    if (locationAddress['latitude'] && locationAddress['longitude']) {
      return `https://www.google.com/maps/search/?api=1&query=${locationAddress['latitude']},${locationAddress['longitude']}`
    }
    if (locationAddress['formatted_address']) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress['formatted_address'])}`
    }
    return null
  }

  const googleMapsUrl = getGoogleMapsUrl()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" aria-hidden="true" />
          <CardTitle>Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ItemGroup className="gap-3">
          {locationAddress['formatted_address'] ? (
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Address</ItemTitle>
                <ItemDescription className="whitespace-pre-line text-foreground">
                  {locationAddress['formatted_address']}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : (
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Address</ItemTitle>
                <ItemDescription className="flex flex-col text-foreground">
                  {locationAddress['street_address'] ? (
                    <span>{locationAddress['street_address']}</span>
                  ) : null}
                  {locationAddress['street_address_2'] ? (
                    <span>{locationAddress['street_address_2']}</span>
                  ) : null}
                  <span>
                    {locationAddress['city']}
                    {locationAddress['state_province'] ? `, ${locationAddress['state_province']}` : ''}
                    {locationAddress['postal_code'] ? ` ${locationAddress['postal_code']}` : ''}
                  </span>
                  {locationAddress['country_code'] ? (
                    <span>{locationAddress['country_code']}</span>
                  ) : null}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}

          {locationAddress['neighborhood'] ? (
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Neighborhood</ItemTitle>
                <ItemDescription className="text-foreground">
                  {locationAddress['neighborhood']}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {locationAddress['landmark'] ? (
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Nearby landmark</ItemTitle>
                <ItemDescription className="text-foreground">
                  {locationAddress['landmark']}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {locationAddress['parking_instructions'] ? (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <ParkingCircle className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Parking information</ItemTitle>
                <ItemDescription className="whitespace-pre-line text-foreground">
                  {locationAddress['parking_instructions']}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {locationAddress['accessibility_notes'] ? (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Accessibility className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Accessibility</ItemTitle>
                <ItemDescription className="whitespace-pre-line text-foreground">
                  {locationAddress['accessibility_notes']}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>

        {googleMapsUrl ? (
          <>
            <Separator />
            <Button asChild variant="outline" className="w-full">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
                Get directions
              </a>
            </Button>
          </>
        ) : null}

        {locationAddress['latitude'] && locationAddress['longitude'] ? (
          <p className="text-center text-xs text-muted-foreground">
            {locationAddress['latitude']}, {locationAddress['longitude']}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
