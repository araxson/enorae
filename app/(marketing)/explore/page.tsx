import { SalonDiscovery } from '@/features/customer/discovery'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Explore Salons',
  description: 'Discover and book appointments at the best salons in your area',
  keywords: ['explore salons', 'find beauty salon', 'book salon appointment'],
})

export default async function ExplorePage() {
  return <SalonDiscovery />
}
