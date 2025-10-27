import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import type { StaffLocationDetail } from '@/features/staff/location/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

interface AllLocationsListProps {
  locations: StaffLocationDetail[]
  currentLocationId?: string | null
}

export function AllLocationsList({ locations, currentLocationId }: AllLocationsListProps) {
  if (locations.length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No locations found</EmptyTitle>
              <EmptyDescription>Add a salon location to see it listed here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {locations.map((location) => {
        const isCurrent = location['id'] === currentLocationId
        const address = [
          location.address_line1,
          location['city'],
          location['state_province'],
        ].filter(Boolean).join(', ')

        return (
          <Card key={location['id']}>
            <CardHeader>
              <ItemGroup>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <CardTitle>{location.location_name || location['name']}</CardTitle>
                  </ItemContent>
                  <ItemActions className="flex gap-2">
                    {isCurrent ? <Badge variant="default">Your Location</Badge> : null}
                    {location['is_primary'] ? <Badge variant="outline">Primary</Badge> : null}
                  </ItemActions>
                </Item>
              </ItemGroup>
            </CardHeader>
            {(address || location.phone_number) && (
              <CardContent>
                <ItemGroup className="space-y-3">
                  {address ? (
                    <Item variant="muted" size="sm">
                      <ItemMedia variant="icon">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemDescription>{address}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ) : null}
                  {location.phone_number ? (
                    <Item variant="muted" size="sm">
                      <ItemContent>
                        <ItemDescription>{location.phone_number}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ) : null}
                </ItemGroup>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
