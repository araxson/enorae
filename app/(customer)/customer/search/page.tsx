import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { SalonSearch } from '@/features/customer/salon-search'

export const metadata = {
  title: 'Search Salons',
  description: 'Find your perfect salon with advanced search and filters',
}

type SearchParams = Promise<{
  q?: string
  city?: string
  state?: string
  verified?: string
  rating?: string
}>

type SalonSearchPageProps = {
  searchParams: SearchParams
}

export default async function SalonSearchPage({ searchParams }: SalonSearchPageProps) {
  const params = await searchParams

  return (
    <Suspense fallback={<PageLoading />}>
      <SalonSearch searchParams={params} />
    </Suspense>
  )
}
