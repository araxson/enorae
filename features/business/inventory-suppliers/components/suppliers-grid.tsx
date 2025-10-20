import { Grid, Box } from '@/components/layout'
import { SupplierCard } from './supplier-card'
import type { Supplier } from '@/lib/types/app.types'

interface SuppliersGridProps {
  suppliers: Supplier[]
}

export function SuppliersGrid({ suppliers }: SuppliersGridProps) {
  if (suppliers.length === 0) {
    return (
      <Box className="text-center py-12">
        <p className="leading-7 text-muted-foreground">No suppliers found</p>
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
