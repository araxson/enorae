import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getSalons } from './api/queries'
import { SalonDiscoveryClient } from './components/salon-discovery-client'

export const salonDiscoveryMetadata = genMeta({
  title: 'Browse Salons',
  description: 'Discover and book appointments at top-rated salons. Find the perfect beauty services near you.',
  keywords: ['browse salons', 'find salon', 'beauty services', 'hair salons', 'spa services'],
})

export async function SalonDiscovery() {
  const salons = await getSalons()
  return <SalonDiscoveryClient initialSalons={salons} />
}

export function SalonDiscoveryFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SalonDiscovery />
    </Suspense>
  )
}
