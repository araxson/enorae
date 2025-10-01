import { getBookingServices, getBookingStaff } from './dal/booking.queries'
import { BookingForm } from './components/booking-form'
import { getSalonBySlug } from '../salon-detail/dal/salon.queries'

interface BookingFlowProps {
  salonSlug: string
  serviceId?: string
}

export async function BookingFlow({ salonSlug, serviceId }: BookingFlowProps) {
  const salon = await getSalonBySlug(salonSlug)

  if (!salon?.id) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Salon not found</h1>
      </div>
    )
  }

  const [services, staff] = await Promise.all([
    getBookingServices(salon.id),
    getBookingStaff(salon.id),
  ])

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book Appointment</h1>
        <p className="text-muted-foreground mt-2">{salon.name}</p>
      </div>

      <BookingForm
        salonId={salon.id}
        services={services}
        staff={staff}
        initialServiceId={serviceId}
      />
    </div>
  )
}