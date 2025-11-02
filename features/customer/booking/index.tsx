import { BookingFeatureContent } from './components'
import type { SalonRouteParams } from './metadata'

export async function BookingFeature({
  params,
}: {
  params: Promise<SalonRouteParams> | SalonRouteParams
}) {
  const resolvedParams = await params
  return <BookingFeatureContent salonId={resolvedParams['salon-id']} />
}

export { generateBookingMetadata } from './metadata'
export * from './types'
