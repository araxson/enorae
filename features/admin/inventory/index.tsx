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
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div>
            <p className="leading-7 text-base font-semibold">Inventory Overview</p>
            <p className="text-sm text-muted-foreground">Platform-wide inventory monitoring and alerts</p>
          </div>

          <InventoryOverview
            summary={summary}
            lowStockAlerts={lowStockAlerts}
            salonValues={salonValues}
            topProducts={topProducts}
            productCatalog={productCatalog}
            suppliers={supplierOverview}
            valuation={valuationSummary}
          />
        </div>
      </div>
    </section>
  )
}
