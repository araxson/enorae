import { BookingRules } from '@/features/shared/booking-rules'

export const metadata = {
  title: 'Booking Rules',
  description: 'Configure booking constraints for services',
}

export default async function BookingRulesPage() {
  return <BookingRules />
}
