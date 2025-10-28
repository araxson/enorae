import { SalonSearchFeature } from '@/features/customer/salon-search'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Salons',
  description: 'Find your perfect salon with advanced search and filters',
}

export default function Page(props: Parameters<typeof SalonSearchFeature>[0]) {
  return <SalonSearchFeature {...props} />
}
