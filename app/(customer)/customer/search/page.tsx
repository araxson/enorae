import { SalonSearch } from '@/features/customer/salon-search'

export const metadata = {
  title: 'Search Salons',
  description: 'Find your perfect salon with advanced search and filters'
}

type SearchParams = Promise<{ q?: string; city?: string; state?: string; verified?: string; rating?: string }>

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  return <SalonSearch searchParams={params} />
}
