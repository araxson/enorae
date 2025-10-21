import { AlertCard } from './alert-card'
import type { StockAlertWithProduct } from '../api/queries'

interface AlertsGridProps {
  alerts: StockAlertWithProduct[]
}

export function AlertsGrid({ alerts }: AlertsGridProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="leading-7 text-muted-foreground">No stock alerts found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
