import { SalonChains } from '@/features/business/chains'

export const metadata = {
  title: 'Salon Chains',
  description: 'Manage multi-location salon chains',
}

export default async function SalonChainsPage() {
  return <SalonChains />
}
