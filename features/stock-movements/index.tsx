import { MovementList } from './components/movement-list'
import type { StockMovementWithDetails } from './dal/stock-movements.queries'

type StockMovementsProps = {
  initialMovements: StockMovementWithDetails[]
}

export function StockMovements({ initialMovements }: StockMovementsProps) {
  return (
    <div className="space-y-6">
      <div>
        <H2>Stock Movements</H2>
        <Muted className="mt-1">
          Track all inventory movements and adjustments
        </Muted>
      </div>

      <MovementList movements={initialMovements} />
    </div>
  )
}
