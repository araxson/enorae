import { SalonChains } from '@/features/business/chains'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Salon Chains',
  description: 'Manage multi-location chain settings and ownership',
  noIndex: true,
})

export default async function ChainsPage() {
  return <SalonChains />
}
