import { InventoryDashboard } from '@/features/inventory/components/inventory-dashboard'
import { ProductsList } from '@/features/inventory/components/products-list'

export default async function InventoryPage() {
  const salonId = 'current-salon-id' // Get from auth context
  return (
    <>
      <InventoryDashboard salonId={salonId} />
      <ProductsList salonId={salonId} />
    </>
  )
}