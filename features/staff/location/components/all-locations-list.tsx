import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Grid } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { MapPin } from 'lucide-react'
import type { StaffLocationDetail } from '../types'

interface AllLocationsListProps {
  locations: StaffLocationDetail[]
  currentLocationId?: string | null
}

export function AllLocationsList({ locations, currentLocationId }: AllLocationsListProps) {
  if (locations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Muted>No locations found</Muted>
      </Card>
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2 }} gap="md">
      {locations.map((location) => {
        const isCurrent = location.id === currentLocationId
        const address = [
          location.address_line1,
          location.city,
          location.state_province,
        ].filter(Boolean).join(', ')

        return (
          <Card key={location.id} className="p-4">
            <Stack gap="sm">
              <Flex align="center" gap="sm">
                <H3 className="text-base">{location.location_name || location.name}</H3>
                {isCurrent && (
                  <Badge variant="default" className="text-xs">Your Location</Badge>
                )}
                {location.is_primary && (
                  <Badge variant="outline" className="text-xs">Primary</Badge>
                )}
              </Flex>

              {address && (
                <Flex align="start" gap="sm">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <Muted className="text-xs">{address}</Muted>
                </Flex>
              )}

              {location.phone_number && (
                <Muted className="text-xs">
                  {location.phone_number}
                </Muted>
              )}
            </Stack>
          </Card>
        )
      })}
    </Grid>
  )
}
