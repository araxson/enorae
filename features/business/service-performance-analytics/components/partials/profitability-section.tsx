'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'

type ServiceProfitability = {
  service_id: string
  service_name: string
  revenue: number
  cost: number
  profit: number
  margin: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function ProfitabilitySection({ profitability }: { profitability: ServiceProfitability[] }) {
  const mostProfitable = [...profitability]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profitability by Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ItemGroup className="flex flex-col gap-2">
          {mostProfitable.map((entry) => (
            <Item key={entry.service_id} variant="outline" className="items-start">
              <ItemContent>
                <h4 className="scroll-m-20 text-base font-semibold tracking-tight">{entry.service_name}</h4>
                <ItemDescription>
                  Margin {Number.isFinite(entry.margin) ? entry.margin.toFixed(1) : '0'}%
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end text-right">
                <span>{formatCurrency(entry.profit)}</span>
                <span className="text-muted-foreground">
                  Revenue {formatCurrency(entry.revenue)} · Cost {formatCurrency(entry.cost)}
                </span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
