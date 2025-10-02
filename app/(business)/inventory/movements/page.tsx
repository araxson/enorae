import { StockMovements } from '@/features/stock-movements'
import { getStockMovements } from '@/features/stock-movements/dal/stock-movements.queries'

export const metadata = {
  title: 'Stock Movements',
  description: 'Track inventory movements and audit trail',
}

export default async function StockMovementsPage() {
  const movements = await getStockMovements()
  return <StockMovements initialMovements={movements} />
}
