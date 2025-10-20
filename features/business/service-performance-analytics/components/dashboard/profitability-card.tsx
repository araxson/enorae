'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { ServiceProfitability } from './types'
import { formatCurrency } from './utils'

export function ProfitabilityCard({ profitability }: { profitability: ServiceProfitability[] }) {
  const mostProfitable = [...profitability]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profitability by Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mostProfitable.map((entry) => (
          <div key={entry.service_id} className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <p className="text-base font-medium">{entry.service_name}</p>
              <p className="text-xs text-muted-foreground">
                Margin {Number.isFinite(entry.margin) ? entry.margin.toFixed(1) : '0'}%
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-base font-semibold">{formatCurrency(entry.profit)}</p>
              <p className="text-muted-foreground">
                Revenue {formatCurrency(entry.revenue)} · Cost {formatCurrency(entry.cost)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
