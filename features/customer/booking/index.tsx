import { redirect } from 'next/navigation'
import { getSalonById, getAvailableServices, getAvailableStaff } from './api/queries'
import { BookingForm } from './components/booking-form'
import type { SalonRouteParams } from './metadata'

interface BookingProps {
  salonId: string
}

export async function Booking({ salonId }: BookingProps) {
  let salon
  try {
    salon = await getSalonById(salonId)
  } catch {
    redirect('/explore')
  }

  if (!salon || !salon.id) {
    redirect('/explore')
  }

  const services = await getAvailableServices(salonId)
  const staff = await getAvailableStaff(salonId)

  const salonName = salon.name || 'Salon'

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <BookingForm
        salonId={salonId}
        salonName={salonName}
        services={services}
        staff={staff}
      />
    </div>
  )
}

export async function BookingFeature({
  params,
}: {
  params: Promise<SalonRouteParams> | SalonRouteParams
}) {
  const resolvedParams = await params

  return <Booking salonId={resolvedParams['salon-id']} />
}

export { generateBookingMetadata } from './metadata'
