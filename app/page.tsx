import { HomePage } from '@/features/marketing/home'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Home - Modern Salon Booking Platform',
  description: 'Book appointments at the best salons. Discover beauty services, spas, and hair salons in your area.',
  keywords: ['salon booking', 'beauty appointments', 'hair salon near me', 'spa booking'],
})

export default function Page() {
  return <HomePage />
}
