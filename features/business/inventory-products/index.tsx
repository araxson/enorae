import { Section, Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getProducts,
  getInventoryStats,
  getStockAlerts,
  getInventorySalon,
  getProductCategories,
  getSuppliers,
} from './api/queries'
import { getStockLevels } from './api/stock-queries'
import { getPurchaseOrders } from '@/features/business/inventory-purchase-orders/api/queries'
import { InventoryManagementClient } from './components/inventory-management-client'

export async function InventoryManagement() {
  // Get salon from DAL
  let salon
  try {
    salon = await getInventorySalon()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Fetch all data in parallel
  const [products, categories, suppliers, stats, alerts, stockLevels, purchaseOrders] = await Promise.all([
    getProducts(salon.id),
    getProductCategories(salon.id),
    getSuppliers(salon.id),
    getInventoryStats(salon.id),
    getStockAlerts(salon.id),
    getStockLevels(salon.id),
    getPurchaseOrders(),
  ])

  return (
    <InventoryManagementClient
      salonId={salon.id}
      products={products}
      categories={categories}
      suppliers={suppliers}
      stats={stats}
      alerts={alerts}
      stockLevels={stockLevels}
      purchaseOrders={purchaseOrders}
    />
  )
}

export function InventoryManagementSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-1/3 rounded bg-muted" />
          <div className="h-32 rounded bg-muted" />
          <div className="h-96 rounded bg-muted" />
        </div>
      </Stack>
    </Section>
  )
}
