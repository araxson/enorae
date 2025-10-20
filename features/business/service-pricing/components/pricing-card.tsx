import { cn } from "@/lib/utils";

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
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
        <Stack gap="sm">
          <Flex justify="between" align="start">
            <Box>
              <h6 className="scroll-m-20 text-base font-semibold tracking-tight">{pricing.service?.name || 'Unknown Service'}</h6>
            </Box>
            {hasDiscount && <Badge variant="destructive">Sale</Badge>}
          </Flex>

          <Stack gap="xs">
            <Flex gap="sm">
              <small className="text-sm font-medium leading-none text-muted-foreground">Base Price:</small>
              <small className={cn('text-sm font-medium leading-none', hasDiscount ? 'line-through' : '')}>
                {formatCurrency(pricing.base_price)}
              </small>
            </Flex>

            {pricing.sale_price && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Sale Price:</small>
                <small className="text-sm font-medium leading-none text-destructive">
                  {formatCurrency(pricing.sale_price)}
                </small>
              </Flex>
            )}

            {pricing.cost && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Cost:</small>
                <small className="text-sm font-medium leading-none">{formatCurrency(pricing.cost)}</small>
              </Flex>
            )}

            {pricing.profit_margin && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Profit Margin:</small>
                <small className="text-sm font-medium leading-none">{pricing.profit_margin.toFixed(1)}%</small>
              </Flex>
            )}

            {pricing.tax_rate && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Tax Rate:</small>
                <small className="text-sm font-medium leading-none">{pricing.tax_rate.toFixed(1)}%</small>
              </Flex>
            )}

            {pricing.commission_rate && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Commission:</small>
                <small className="text-sm font-medium leading-none">{pricing.commission_rate.toFixed(1)}%</small>
              </Flex>
            )}

            <Flex gap="sm">
              <small className="text-sm font-medium leading-none text-muted-foreground">Taxable:</small>
              <small className="text-sm font-medium leading-none">{pricing.is_taxable ? 'Yes' : 'No'}</small>
            </Flex>
          </Stack>

          <Flex justify="end" gap="sm">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(pricing)}>
                Edit
              </Button>
            )}
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  )
}
