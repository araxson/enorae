import { SalonGrid } from './components/salon-grid'
import { SearchFilters } from './components/search-filters'
import { getSalons } from './dal/salons.queries'

export async function SalonDiscovery() {
  const salons = await getSalons()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Salon</h1>
      <div className="grid grid-cols-4 gap-6">
        <SearchFilters />
        <div className="col-span-3">
          <SalonGrid salons={salons} />
        </div>
      </div>
    </div>
  )
}