'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { deleteProductUsage } from '../api/mutations'
import type { ProductUsage } from '../types'

interface ProductUsageListProps {
  productUsage: ProductUsage[]
}

export function ProductUsageList({ productUsage }: ProductUsageListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product usage record?')) return

    try {
      setDeletingId(id)
      await deleteProductUsage(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product usage')
    } finally {
      setDeletingId(null)
    }
  }

  if (productUsage.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="leading-7 text-muted-foreground">No product usage records found</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {productUsage.map((usage) => (
        <Card key={usage.id} className="p-4">
          <div className="flex gap-4 items-start justify-between">
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex gap-3 items-center">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Product {usage.product_id}</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                Quantity: {usage.quantity_used}
              </p>

              {usage.cost_at_time && (
                <p className="text-sm text-muted-foreground">
                  Cost: ${Number(usage.cost_at_time).toFixed(2)}
                </p>
              )}

              {usage.notes && (
                <p className="leading-7 text-sm">{usage.notes}</p>
              )}

              {usage.created_at && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(usage.created_at), 'PPp')}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => usage.id && handleDelete(usage.id)}
              disabled={deletingId === usage.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
