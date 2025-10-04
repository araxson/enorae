import { StockLocations } from '@/features/business/inventory/locations'

export const metadata = {
  title: 'Stock Locations',
  description: 'Manage inventory storage locations',
}

export default async function StockLocationsPage() {
  return <StockLocations />
}
