import { StockLocations } from '@/features/stock-locations'
import { getStockLocations } from '@/features/stock-locations/dal/stock-locations.queries'

export const metadata = {
  title: 'Stock Locations',
  description: 'Manage inventory storage locations',
}

export default async function StockLocationsPage() {
  const locations = await getStockLocations()
  return <StockLocations initialLocations={locations} />
}
