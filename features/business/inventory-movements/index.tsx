import { getStockMovements, getInventoryMovementReferences } from './api/queries'
import { MovementsClient } from './components/movements-client'
import { getUserSalon } from '@/features/business/dashboard/api/queries'

export async function StockMovements() {
  const salon = await getUserSalon()

  if (!salon) {
    return (
      <MovementsClient
        movements={[]}
        products={[]}
        locations={[]}
      />
    )
  }

  const [movements, references] = await Promise.all([
    getStockMovements(),
    getInventoryMovementReferences(),
  ])

  return (
    <MovementsClient
      movements={movements}
      products={references.products}
      locations={references.locations}
    />
  )
}
