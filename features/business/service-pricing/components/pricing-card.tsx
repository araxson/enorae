import { cn } from "@/lib/utils";

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ServicePricingWithService } from '../api/queries'

interface PricingCardProps {
  pricing: ServicePricingWithService
  onEdit?: (pricing: ServicePricingWithService) => void
}

export function PricingCard({ pricing, onEdit }: PricingCardProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing.currency_code,
    }).format(amount)
  }

  const hasDiscount = pricing.sale_price && pricing.sale_price < pricing.base_price

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 items-start justify-between">
            <div>
              <h6 className="scroll-m-20 text-base font-semibold">{pricing.service?.name || 'Unknown Service'}</h6>
            </div>
            {hasDiscount && <Badge variant="destructive">Sale</Badge>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <p className="text-sm font-medium text-muted-foreground">Base Price:</p>
              <p className={cn('text-sm font-medium', hasDiscount ? 'line-through' : '')}>
                {formatCurrency(pricing.base_price)}
              </p>
            </div>

            {pricing.sale_price && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Sale Price:</p>
                <p className="text-sm font-medium text-destructive">
                  {formatCurrency(pricing.sale_price)}
                </p>
              </div>
            )}

            {pricing.cost && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Cost:</p>
                <p className="text-sm font-medium">{formatCurrency(pricing.cost)}</p>
              </div>
            )}

            {pricing.profit_margin && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Profit Margin:</p>
                <p className="text-sm font-medium">{pricing.profit_margin.toFixed(1)}%</p>
              </div>
            )}

            {pricing.tax_rate && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Tax Rate:</p>
                <p className="text-sm font-medium">{pricing.tax_rate.toFixed(1)}%</p>
              </div>
            )}

            {pricing.commission_rate && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Commission:</p>
                <p className="text-sm font-medium">{pricing.commission_rate.toFixed(1)}%</p>
              </div>
            )}

            <div className="flex gap-3">
              <p className="text-sm font-medium text-muted-foreground">Taxable:</p>
              <p className="text-sm font-medium">{pricing.is_taxable ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(pricing)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
