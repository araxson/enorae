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
      currency: 'USD',
    }).format(amount)
  }

  const hasDiscount = false // sale_price not in type

  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader className="flex flex-row items-start justify-between">
        <ItemTitle>{pricing.service?.name || pricing.service_name || 'Unknown Service'}</ItemTitle>
        {hasDiscount ? <Badge variant="destructive">Sale</Badge> : null}
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <p className="text-muted-foreground">Base Price:</p>
              <p className={cn(hasDiscount ? 'line-through' : '')}>
                {formatCurrency(pricing.base_price)}
              </p>
            </div>

            {pricing.min_price && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Min Price:</p>
                <p>{formatCurrency(pricing.min_price)}</p>
              </div>
            )}

            {pricing.max_price && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Max Price:</p>
                <p>{formatCurrency(pricing.max_price)}</p>
              </div>
            )}

            {pricing.pricing_type && (
              <div className="flex gap-3">
                <p className="text-muted-foreground">Pricing Type:</p>
                <p>{pricing.pricing_type}</p>
              </div>
            )}

            <div className="flex gap-3">
              <p className="text-muted-foreground">Service:</p>
              <p>{pricing.service_name || 'Unknown'}</p>
            </div>
          </div>

          {onEdit ? (
            <ButtonGroup aria-label="Actions">
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
