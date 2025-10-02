import { Booking } from '@/features/booking'
import { getSalonMetadata } from '@/features/booking/dal/booking.queries'
import { generateMetadata as genMeta } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ salonId: string }>
}): Promise<Metadata> {
  const { salonId } = await params

  const salon = await getSalonMetadata(salonId)
  const salonName = salon?.name || 'Salon'
  const salonDesc = salon?.description

  return genMeta({
    title: `Book Appointment - ${salonName}`,
    description: salonDesc || `Book your appointment at ${salonName}`,
    keywords: ['book appointment', 'salon booking', salonName],
  })
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ salonId: string }>
}) {
  const { salonId } = await params
  return <Booking salonId={salonId} />
}
