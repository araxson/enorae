import { Section, Stack } from '@/components/layout'
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
    <Stack gap="lg">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Location Information</h1>
        <p className="text-sm text-muted-foreground">Your assigned salon location and other branches</p>
      </div>

      {myLocation ? (
        <Stack gap="md">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Your Location</h2>
          <LocationCard location={myLocation} />
        </Stack>
      ) : (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            No specific location assigned. You may work at any salon location.
          </AlertDescription>
        </Alert>
      )}

      {allLocations.length > 1 && (
        <Stack gap="md">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">All Salon Locations</h2>
          <AllLocationsList
            locations={allLocations}
            currentLocationId={myLocation?.id}
          />
        </Stack>
      )}
    </Stack>
  )
}

export async function StaffLocationPage() {
  const [myLocation, allLocations] = await Promise.all([
    getMyLocation(),
    getAllSalonLocations(),
  ])

  return (
    <Section size="lg">
      <LocationFeature myLocation={myLocation} allLocations={allLocations} />
    </Section>
  )
}
