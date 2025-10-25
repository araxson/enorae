'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PricingGrid } from './pricing-grid'
import { PricingFormDialog } from './pricing-form-dialog'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'

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
        <div className="flex gap-4 items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Service Pricing</h1>
            <p className="text-sm text-muted-foreground">
              Manage pricing for your salon services
            </p>
          </div>
          <Button onClick={handleAddPricing}>Add Pricing</Button>
        </div>

        <div className="flex gap-4">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle>Total Services</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{pricing.length}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle>Average Price</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">
                ${avgPrice.toFixed(2)}
              </div>
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
