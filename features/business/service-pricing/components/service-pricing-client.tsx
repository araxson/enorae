'use client'

import { useState } from 'react'
import { Section, Stack, Box, Flex } from '@/components/layout'
import { H1, H3, Muted, Small } from '@/components/ui/typography'
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
            <H1>Service Pricing</H1>
            <Muted>
              Manage pricing for your salon services
            </Muted>
          </Box>
          <Button onClick={handleAddPricing}>Add Pricing</Button>
        </Flex>

        <Flex gap="md">
          <Box className="rounded-lg border p-4">
            <Small>Total Services</Small>
            <H3>{pricing.length}</H3>
          </Box>
          <Box className="rounded-lg border p-4">
            <Small>Average Price</Small>
            <H3>
              ${avgPrice.toFixed(2)}
            </H3>
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
