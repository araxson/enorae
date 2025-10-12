import { getStockLocations } from './api/queries'
import { StockLocationsClient } from './components/stock-locations-client'

export async function StockLocations() {
  const locations = await getStockLocations()
  return <StockLocationsClient initialLocations={locations} />
}
