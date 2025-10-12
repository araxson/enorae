import { Grid, Box } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { SupplierCard } from './supplier-card'
import type { Supplier } from '@/lib/types/app.types'

interface SuppliersGridProps {
  suppliers: Supplier[]
}

export function SuppliersGrid({ suppliers }: SuppliersGridProps) {
  if (suppliers.length === 0) {
    return (
      <Box className="text-center py-12">
        <P className="text-muted-foreground">No suppliers found</P>
      </Box>
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </Grid>
  )
}
