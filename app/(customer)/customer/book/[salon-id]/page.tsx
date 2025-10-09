import { Booking } from '@/features/customer/booking'
import { getSalonMetadata } from '@/features/customer/booking/api/queries'
import { generateMetadata as genMeta } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: Promise<{ 'salon-id': string }> }) {
  const resolvedParams = await params
  const salonId = resolvedParams['salon-id']
  const salon = await getSalonMetadata(salonId).catch(() => null)
  const name = salon?.name || 'Salon'
  return genMeta({ title: `Book Appointment - ${name}`, description: salon?.description || `Book your appointment at ${name}`, keywords: ['book appointment', 'salon booking', name] })
}

export default async function BookPage({ params }: { params: Promise<{ 'salon-id': string }> }) {
  const resolvedParams = await params
  const salonId = resolvedParams['salon-id']
  return <Booking salonId={salonId} />
}
