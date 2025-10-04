import { Grid, Box } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { PricingCard } from './pricing-card'
import type { ServicePricingWithService } from '../api/queries'

interface PricingGridProps {
  pricing: ServicePricingWithService[]
  onEdit?: (pricing: ServicePricingWithService) => void
}

export function PricingGrid({ pricing, onEdit }: PricingGridProps) {
  if (pricing.length === 0) {
    return (
      <Box className="text-center py-12">
        <P className="text-muted-foreground">No pricing configured yet</P>
      </Box>
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {pricing.map((p) => (
        <PricingCard key={p.id} pricing={p} onEdit={onEdit} />
      ))}
    </Grid>
  )
}
