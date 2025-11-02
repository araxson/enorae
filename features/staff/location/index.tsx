import { LocationFeature } from './components'
import { getMyLocation, getAllSalonLocations } from './api/queries'

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
export * from './types'
