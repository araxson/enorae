import { BookingRules } from '@/features/business/booking-rules'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Booking Rules',
  description: 'Configure booking constraints and lead times for services',
  noIndex: true,
})

export default async function BookingRulesPage() {
  return <BookingRules />
}
