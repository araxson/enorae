'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'
import { PricingFormDialog } from './pricing-form-dialog'
import { PricingGrid } from './pricing-grid'

interface ServicePricingClientProps {
  pricing: ServicePricingWithService[]
  services: Array<{ id: string; name: string }>
}

export function ServicePricingClient({ pricing, services }: ServicePricingClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editPricing, setEditPricing] = useState<ServicePricingWithService | null>(null)

  const avgPrice = pricing.length > 0
    ? pricing.reduce((sum, p) => sum + (p['current_price'] ?? p['base_price'] ?? 0), 0) / pricing.length
    : 0

  const handleAddPricing = () => {
    setEditPricing(null)
    setDialogOpen(true)
  }

  const handleEditPricing = (pricingData: ServicePricingWithService) => {
    setEditPricing(pricingData)
    setDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setEditPricing(null)
    }
    setDialogOpen(open)
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <ItemGroup className="gap-2">
            <Item variant="muted" className="flex-col items-start gap-2">
              <ItemContent>
                <ItemTitle>Service Pricing</ItemTitle>
                <ItemDescription>Manage pricing for your salon services</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
          <Button onClick={handleAddPricing}>Add Pricing</Button>
        </div>

        <ItemGroup className="grid gap-4 md:grid-cols-2">
          <Item variant="outline" className="flex-col gap-3">
            <ItemHeader>
              <ItemTitle>Total Services</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <CardTitle>{pricing.length}</CardTitle>
            </ItemContent>
          </Item>
          <Item variant="outline" className="flex-col gap-3">
            <ItemHeader>
              <ItemTitle>Average Price</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <CardTitle>
                $
                {avgPrice.toFixed(2)}
              </CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>

        <PricingGrid pricing={pricing} onEdit={handleEditPricing} />

        <PricingFormDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          services={services}
          editPricing={editPricing}
        />
      </div>
    </section>
  )
}
