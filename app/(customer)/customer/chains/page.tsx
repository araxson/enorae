import { CustomerChainsPage } from '@/features/customer/chains'

export const metadata = {
  title: 'Salon Chains | Enorae',
  description: 'Browse salon chains and their locations',
}

export default async function ChainsPage() {
  return <CustomerChainsPage />
}
