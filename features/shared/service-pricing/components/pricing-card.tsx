'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
import { Small, H6 } from '@/components/ui/typography'
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
    <Card className="p-4">
      <Stack gap="sm">
        <Flex justify="between" align="start">
          <Box>
            <H6>{pricing.service?.name || 'Unknown Service'}</H6>
          </Box>
          {hasDiscount && <Badge variant="destructive">Sale</Badge>}
        </Flex>

        <Stack gap="xs">
          <Flex gap="sm">
            <Small className="text-muted-foreground">Base Price:</Small>
            <Small className={hasDiscount ? 'line-through' : ''}>
              {formatCurrency(pricing.base_price)}
            </Small>
          </Flex>

          {pricing.sale_price && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Sale Price:</Small>
              <Small className="text-destructive">
                {formatCurrency(pricing.sale_price)}
              </Small>
            </Flex>
          )}

          {pricing.cost && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Cost:</Small>
              <Small>{formatCurrency(pricing.cost)}</Small>
            </Flex>
          )}

          {pricing.profit_margin && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Profit Margin:</Small>
              <Small>{pricing.profit_margin.toFixed(1)}%</Small>
            </Flex>
          )}

          {pricing.tax_rate && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Tax Rate:</Small>
              <Small>{pricing.tax_rate.toFixed(1)}%</Small>
            </Flex>
          )}

          {pricing.commission_rate && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Commission:</Small>
              <Small>{pricing.commission_rate.toFixed(1)}%</Small>
            </Flex>
          )}

          <Flex gap="sm">
            <Small className="text-muted-foreground">Taxable:</Small>
            <Small>{pricing.is_taxable ? 'Yes' : 'No'}</Small>
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
    </Card>
  )
}
