'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PricingGrid } from './pricing-grid'
import { PricingFormDialog } from './pricing-form-dialog'
import type { ServicePricingWithService } from '../api/queries'

interface ServicePricingClientProps {
  pricing: ServicePricingWithService[]
  services: Array<{ id: string; name: string }>
}

export function ServicePricingClient({ pricing, services }: ServicePricingClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editPricing, setEditPricing] = useState<ServicePricingWithService | null>(null)

  const avgPrice = pricing.length > 0
    ? pricing.reduce((sum, p) => sum + (p.current_price || p.base_price), 0) / pricing.length
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
        <div className="flex gap-4 items-start justify-between">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Service Pricing</h1>
            <p className="text-sm text-muted-foreground">
              Manage pricing for your salon services
            </p>
          </div>
          <Button onClick={handleAddPricing}>Add Pricing</Button>
        </div>

        <div className="flex gap-4">
          <Card className="w-full">
            <CardContent className="p-4">
              <p className="text-sm font-medium">Total Services</p>
              <h3 className="scroll-m-20 text-2xl font-semibold">{pricing.length}</h3>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <p className="text-sm font-medium">Average Price</p>
              <h3 className="scroll-m-20 text-2xl font-semibold">
                ${avgPrice.toFixed(2)}
              </h3>
            </CardContent>
          </Card>
        </div>

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
