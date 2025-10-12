import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { SalonDiscovery } from '@/features/customer/discovery'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Browse Salons',
  description: 'Discover and book appointments at top-rated salons. Find the perfect beauty services near you.',
  keywords: ['browse salons', 'find salon', 'beauty services', 'hair salons', 'spa services'],
})

export default function SalonDiscoveryPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SalonDiscovery />
    </Suspense>
  )
}
