import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { MapPin } from 'lucide-react'
import { LocationCard, AllLocationsList } from './index'
import type { StaffLocationDetail } from '../types'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

interface LocationFeatureProps {
  myLocation: StaffLocationDetail | null
  allLocations: StaffLocationDetail[]
}

export function LocationFeature({ myLocation, allLocations }: LocationFeatureProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Location Information</CardTitle>
                <CardDescription>Your assigned salon location and other branches</CardDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
      </Card>

      {myLocation ? (
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemContent>
                  <CardTitle>Your Location</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <LocationCard location={myLocation} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapPin className="h-8 w-8" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No assigned location</EmptyTitle>
                <EmptyDescription>
                  No specific location assigned. You may work at any salon location.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {allLocations.length > 1 && (
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemContent>
                  <CardTitle>All Salon Locations</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <AllLocationsList
              locations={allLocations}
              currentLocationId={myLocation?.['id']}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
