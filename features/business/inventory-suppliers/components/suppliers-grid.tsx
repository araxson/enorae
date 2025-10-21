import { SupplierCard } from './supplier-card'
import type { Supplier } from '@/lib/types/app.types'

interface SuppliersGridProps {
  suppliers: Supplier[]
}

export function SuppliersGrid({ suppliers }: SuppliersGridProps) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="leading-7 text-muted-foreground">No suppliers found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  )
}
