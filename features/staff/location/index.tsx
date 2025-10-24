import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { LocationCard } from './components/location-card'
import { AllLocationsList } from './components/all-locations-list'
import { getMyLocation, getAllSalonLocations } from './api/queries'
import type { StaffLocationDetail } from './types'

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
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            No specific location assigned. You may work at any salon location.
          </AlertDescription>
        </Alert>
      )}

      {allLocations.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>All Salon Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <AllLocationsList
              locations={allLocations}
              currentLocationId={myLocation?.id}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export async function StaffLocationPage() {
  const [myLocation, allLocations] = await Promise.all([
    getMyLocation(),
    getAllSalonLocations(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <LocationFeature myLocation={myLocation} allLocations={allLocations} />
    </section>
  )
}
