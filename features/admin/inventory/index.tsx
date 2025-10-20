import { Section, Stack, Box } from '@/components/layout'
import {
  getInventorySummary,
  getLowStockAlerts,
  getSalonInventoryValues,
  getTopProducts,
  getProductCatalog,
  getSupplierOverview,
  getInventoryValuation,
} from './api/queries'
import { InventoryOverview } from './components/inventory-overview'

export async function AdminInventory() {
  const [
    summary,
    lowStockAlerts,
    salonValues,
    topProducts,
    productCatalog,
    supplierOverview,
    valuationSummary,
  ] = await Promise.all([
    getInventorySummary(),
    getLowStockAlerts(50),
    getSalonInventoryValues(),
    getTopProducts(20),
    getProductCatalog(100),
    getSupplierOverview(),
    getInventoryValuation(),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <p className="leading-7 text-base font-semibold">Inventory Overview</p>
          <p className="text-sm text-muted-foreground">Platform-wide inventory monitoring and alerts</p>
        </Box>

        <InventoryOverview
          summary={summary}
          lowStockAlerts={lowStockAlerts}
          salonValues={salonValues}
          topProducts={topProducts}
          productCatalog={productCatalog}
          suppliers={supplierOverview}
          valuation={valuationSummary}
        />
      </Stack>
    </Section>
  )
}
