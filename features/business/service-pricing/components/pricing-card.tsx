'use client'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

interface PricingCardProps {
  pricing: ServicePricingWithService
  onEdit?: (pricing: ServicePricingWithService) => void
}

export function PricingCard({ pricing, onEdit }: PricingCardProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing['currency_code'] ?? 'USD',
    }).format(amount)
  }

  const hasDiscount = pricing['sale_price'] && pricing['base_price'] && pricing['sale_price'] < pricing['base_price']

  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader className="flex flex-row items-start justify-between">
        <ItemTitle>{pricing.service?.['name'] || 'Unknown Service'}</ItemTitle>
        {hasDiscount ? <Badge variant="destructive">Sale</Badge> : null}
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <p className="text-muted-foreground">Base Price:</p>
              <p className={cn(hasDiscount ? 'line-through' : '')}>
                {formatCurrency(pricing['base_price'])}
              </p>
            </div>

            {pricing['sale_price'] && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Sale Price:</p>
                <p className="text-destructive">
                  {formatCurrency(pricing['sale_price'])}
                </p>
              </div>
            )}

            {pricing['cost'] && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Cost:</p>
                <p>{formatCurrency(pricing['cost'])}</p>
              </div>
            )}

            {pricing['profit_margin'] && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Profit Margin:</p>
                <p>{pricing['profit_margin'].toFixed(1)}%</p>
              </div>
            )}

            {pricing['tax_rate'] && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Tax Rate:</p>
                <p>{pricing['tax_rate'].toFixed(1)}%</p>
              </div>
            )}

            {pricing['commission_rate'] && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Commission:</p>
                <p>{pricing['commission_rate'].toFixed(1)}%</p>
              </div>
            )}

            <div className="flex gap-3">
              <p className="text-muted-foreground">Taxable:</p>
              <p>{pricing['is_taxable'] ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {onEdit ? (
            <ButtonGroup className="justify-end">
              <Button size="sm" variant="outline" onClick={() => onEdit(pricing)}>
                Edit
              </Button>
            </ButtonGroup>
          ) : null}
        </div>
      </ItemContent>
    </Item>
  )
}
