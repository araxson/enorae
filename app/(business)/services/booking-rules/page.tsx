import { BookingRules } from '@/features/booking-rules'

export const metadata = {
  title: 'Booking Rules',
  description: 'Configure service booking rules and constraints',
}

export default async function BookingRulesPage() {
  return <BookingRules />
}
