import 'server-only'

import { getSalonMetadata } from '@/features/customer/booking/api/queries'
import { generateMetadata as genMeta } from '@/lib/metadata'

export type SalonRouteParams = { 'salon-id': string }

export async function generateBookingMetadata({
  params,
}: {
  params: Promise<SalonRouteParams> | SalonRouteParams
}) {
  const resolvedParams = await params
  const salonId = resolvedParams['salon-id']
  const salon = await getSalonMetadata(salonId).catch(() => null)
  const name = salon?.name ?? 'Salon'

  return genMeta({
    title: `Book Appointment - ${name}`,
    description: salon?.short_description ?? `Book your appointment at ${name}`,
    keywords: ['book appointment', 'salon booking', name],
  })
}
