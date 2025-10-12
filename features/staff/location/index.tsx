import { Section, Stack } from '@/components/layout'
import { H1, H2, Muted } from '@/components/ui/typography'
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
        <H1>Location Information</H1>
        <Muted>Your assigned salon location and other branches</Muted>
      </div>

      {myLocation ? (
        <Stack gap="md">
          <H2>Your Location</H2>
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
          <H2>All Salon Locations</H2>
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
