import { AlertsGrid } from './components/alerts-grid'
import { getStockAlerts } from './api/queries'

export async function StockAlerts() {
  const alerts = await getStockAlerts()

  // Calculate counts for filtering
  const unresolvedCount = alerts.filter((a) => !a.is_resolved).length

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {unresolvedCount > 0 && (
            <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
              <small className="text-sm font-medium font-semibold text-destructive">
                {unresolvedCount} unresolved alert{unresolvedCount > 1 ? 's' : ''} require
                {unresolvedCount === 1 ? 's' : ''} attention
              </small>
            </div>
          )}

          <AlertsGrid alerts={alerts} />
        </div>
      </div>
    </section>
  )
}
