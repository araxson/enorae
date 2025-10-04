import { SalonBusinessInfo } from '@/features/business/settings/salon'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Salon Information',
  description: 'Manage your salon business details and legal information',
}

export default async function SalonBusinessInfoPage() {
  return <SalonBusinessInfo />
}
