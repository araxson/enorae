import { Booking } from '@/features/customer/booking'
import { getSalonMetadata } from '@/features/customer/booking/api/queries'
import { generateMetadata as genMeta } from '@/lib/metadata'

type SalonRouteParams = { 'salon-id': string }

export async function generateMetadata({
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
    description: salon?.description ?? `Book your appointment at ${name}`,
    keywords: ['book appointment', 'salon booking', name],
  })
}

type PageProps = {
  params: Promise<SalonRouteParams>
}

export default async function BookingPage({ params }: PageProps) {
  const resolvedParams = await params
  return <Booking salonId={resolvedParams['salon-id']} />
}
