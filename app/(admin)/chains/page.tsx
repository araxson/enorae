import { SalonChains } from '@/features/salon-chains'
import { getSalonChains } from '@/features/salon-chains/dal/salon-chains.queries'

export const metadata = {
  title: 'Salon Chains',
  description: 'Manage multi-location salon chains',
}

export default async function SalonChainsPage() {
  const chains = await getSalonChains()
  return <SalonChains initialChains={chains} />
}
