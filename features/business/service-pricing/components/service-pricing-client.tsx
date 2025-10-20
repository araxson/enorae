'use client'

import { useState } from 'react'
import { Section, Stack, Box, Flex } from '@/components/layout'
import { Button } from '@/components/ui/button'
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
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="start">
          <Box>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Service Pricing</h1>
            <p className="text-sm text-muted-foreground">
              Manage pricing for your salon services
            </p>
          </Box>
          <Button onClick={handleAddPricing}>Add Pricing</Button>
        </Flex>

        <Flex gap="md">
          <Box className="rounded-lg border p-4">
            <small className="text-sm font-medium leading-none">Total Services</small>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{pricing.length}</h3>
          </Box>
          <Box className="rounded-lg border p-4">
            <small className="text-sm font-medium leading-none">Average Price</small>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              ${avgPrice.toFixed(2)}
            </h3>
          </Box>
        </Flex>

        <PricingGrid pricing={pricing} onEdit={handleEditPricing} />

        <PricingFormDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          services={services}
          editPricing={editPricing}
        />
      </Stack>
    </Section>
  )
}
