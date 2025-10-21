import { Alert, AlertDescription } from '@/components/ui/alert'
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
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Location Information</h1>
        <p className="text-sm text-muted-foreground">Your assigned salon location and other branches</p>
      </div>

      {myLocation ? (
        <div className="flex flex-col gap-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Your Location</h2>
          <LocationCard location={myLocation} />
        </div>
      ) : (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            No specific location assigned. You may work at any salon location.
          </AlertDescription>
        </Alert>
      )}

      {allLocations.length > 1 && (
        <div className="flex flex-col gap-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">All Salon Locations</h2>
          <AllLocationsList
            locations={allLocations}
            currentLocationId={myLocation?.id}
          />
        </div>
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
