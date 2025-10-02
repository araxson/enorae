import { redirect } from 'next/navigation'
import { getSalonById, getAvailableServices, getAvailableStaff } from './dal/booking.queries'
import { BookingForm } from './components/booking-form'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

interface BookingProps {
  salonId: string
}

export async function Booking({ salonId }: BookingProps) {
  let salon
  try {
    salon = await getSalonById(salonId)
  } catch (error) {
    redirect('/explore')
  }

  if (!salon || !salon.id) {
    redirect('/explore')
  }

  const services = await getAvailableServices(salonId)
  const staff = await getAvailableStaff(salonId)

  const salonName = salon.name || 'Salon'

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Book at {salonName}</H1>
          <Lead>Choose a service and time for your appointment</Lead>
        </div>
        <BookingForm salonId={salonId} services={services} staff={staff} />
      </Stack>
    </Section>
  )
}
