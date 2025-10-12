import { BookingRules } from '@/features/business/booking-rules'

export const metadata = {
  title: 'Booking Rules',
  description: 'Configure booking constraints for services',
}

export default async function BookingRulesPage() {
  return <BookingRules />
}
