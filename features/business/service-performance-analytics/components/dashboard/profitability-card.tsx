'use client'

import type { ServiceProfitability } from './types'
import { formatCurrency } from './utils'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function ProfitabilityCard({ profitability }: { profitability: ServiceProfitability[] }) {
  const mostProfitable = [...profitability]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Profitability by Service</ItemTitle>
      </ItemHeader>
      <ItemContent className="space-y-3">
        <ItemGroup className="space-y-3">
          {mostProfitable.map((entry) => (
            <Item key={entry.service_id} variant="outline" className="items-start gap-4">
              <ItemContent>
                <ItemTitle>{entry.service_name}</ItemTitle>
                <ItemDescription>
                  Margin {Number.isFinite(entry.margin) ? entry.margin.toFixed(1) : '0'}%
                </ItemDescription>
              </ItemContent>
              <div className="text-right text-sm">
                <p className="text-base font-semibold">{formatCurrency(entry.profit)}</p>
                <p className="text-muted-foreground">
                  Revenue {formatCurrency(entry.revenue)} · Cost {formatCurrency(entry.cost)}
                </p>
              </div>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
