import { Alert, AlertDescription } from '@/components/ui/alert'
import { StockLevelsTable } from '@/features/business/inventory-products/components/stock-levels-table'
import { getStockLevels, getStockLocations } from './api/queries'
import { transferStock, adjustStock } from './api/mutations'

export async function StockLevels() {
  let stockLevels, locations

  try {
    ;[stockLevels, locations] = await Promise.all([
      getStockLevels(),
      getStockLocations(),
    ])
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load stock levels'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <StockLevelsTable
          stockLevels={stockLevels}
          locations={locations.map((loc) => ({
            id: loc.id!,
            name: loc.name || 'Unknown',
          }))}
          onTransfer={transferStock}
          onAdjust={adjustStock}
        />
      </div>
    </section>
  )
}
