import type { Metadata } from 'next'

export interface SalonRouteParams {
  'salon-id': string
}

export async function generateBookingMetadata({
  params,
}: {
  params: Promise<SalonRouteParams> | SalonRouteParams
}): Promise<Metadata> {
  const resolvedParams = await params
  const salonId = resolvedParams['salon-id']

  return {
    title: 'Book Appointment',
    description: `Book an appointment at this salon. View available services and staff members.`,
    openGraph: {
      title: 'Book Appointment',
      description: `Book an appointment at this salon`,
      type: 'website',
    },
  }
}
