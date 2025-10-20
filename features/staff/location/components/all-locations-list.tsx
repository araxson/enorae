import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No locations found</p>
        </CardContent>
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
          <Card key={location.id}>
            <CardHeader className="p-4 pb-2">
              <Flex align="center" gap="sm" wrap="wrap">
                <CardTitle className="text-base">
                  {location.location_name || location.name}
                </CardTitle>
                {isCurrent && <Badge variant="default" className="text-xs">Your Location</Badge>}
                {location.is_primary && <Badge variant="outline" className="text-xs">Primary</Badge>}
              </Flex>
            </CardHeader>
            {(address || location.phone_number) && (
              <CardContent className="p-4 pt-0">
                <Stack gap="sm">
                  {address && (
                    <Flex align="start" gap="sm">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{address}</p>
                    </Flex>
                  )}
                  {location.phone_number && (
                    <p className="text-sm text-muted-foreground">
                      {location.phone_number}
                    </p>
                  )}
                </Stack>
              </CardContent>
            )}
          </Card>
        )
      })}
    </Grid>
  )
}
