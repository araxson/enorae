import { SalonSearch } from '@/features/customer/salon-search'

export const metadata = {
  title: 'Search Salons',
  description: 'Find your perfect salon with advanced search and filters',
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    city?: string
    state?: string
    verified?: string
    rating?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SalonSearch searchParams={params} />
    </div>
  )
}
