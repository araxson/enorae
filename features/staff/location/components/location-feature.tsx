import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { MapPin } from 'lucide-react'
import { LocationCard } from './location-card'
import { AllLocationsList } from './all-locations-list'
import type { StaffLocationDetail } from '../types'

interface LocationFeatureProps {
  myLocation: StaffLocationDetail | null
  allLocations: StaffLocationDetail[]
}

export function LocationFeature({ myLocation, allLocations }: LocationFeatureProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>Your assigned salon location and other branches</CardDescription>
        </CardHeader>
      </Card>

      {myLocation ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Location</CardTitle>
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
                  <MapPin className="size-8" aria-hidden="true" />
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
            <CardTitle>All Salon Locations</CardTitle>
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
