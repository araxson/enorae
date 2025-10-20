import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Grid } from '@/components/layout'
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
        <p className="text-sm text-muted-foreground">No locations found</p>
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
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">{location.location_name || location.name}</h3>
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
                  <p className="text-sm text-muted-foreground text-xs">{address}</p>
                </Flex>
              )}

              {location.phone_number && (
                <p className="text-sm text-muted-foreground text-xs">
                  {location.phone_number}
                </p>
              )}
            </Stack>
          </Card>
        )
      })}
    </Grid>
  )
}
