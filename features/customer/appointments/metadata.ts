import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateAppointmentsMetadata() {
  return genMeta({
    title: 'My Appointments',
    description: 'View and manage your salon appointments. Check upcoming bookings, reschedule, or cancel appointments.',
    keywords: ['appointments', 'bookings', 'my appointments', 'manage bookings', 'salon appointments'],
  })
}
