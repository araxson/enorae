import type { Metadata } from 'next'
import { SalonChainDetailFeature } from '@/features/customer/chains'

export const metadata: Metadata = {
  title: 'Salon Chain Details - ENORAE',
  description: 'Explore salon chain locations, services, and offerings',
}

export default function Page(props: Parameters<typeof SalonChainDetailFeature>[0]) {
  return <SalonChainDetailFeature {...props} />
}
