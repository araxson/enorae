'use client'

import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'
import { formatCurrency } from './value-formatters'

type BreakdownItem = {
  label: string
  amount: number
}

type RevenueCardBreakdownProps = {
  breakdown: BreakdownItem[]
  currency?: string
}

export function RevenueCardBreakdown({
  breakdown,
  currency = 'USD',
}: RevenueCardBreakdownProps) {
  if (!breakdown || breakdown.length === 0) return null

  return (
    <>
      <Separator />
      <ItemGroup className="flex flex-col gap-2">
        {breakdown.map((item) => (
          <Item key={item.label}>
            <ItemContent>
              <ItemDescription>{item.label}</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none">
              <ItemDescription>
                {formatCurrency(item.amount, { currency })}
              </ItemDescription>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </>
  )
}
