'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
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
        <P className="text-muted-foreground">No product usage records found</P>
      </Card>
    )
  }

  return (
    <Stack gap="md">
      {productUsage.map((usage) => (
        <Card key={usage.id} className="p-4">
          <Flex justify="between" align="start">
            <Stack gap="sm" className="flex-1">
              <Flex align="center" gap="sm">
                <H3>Product {usage.product_id}</H3>
              </Flex>

              <Muted>
                Quantity: {usage.quantity_used}
              </Muted>

              {usage.cost_at_time && (
                <Muted>
                  Cost: ${Number(usage.cost_at_time).toFixed(2)}
                </Muted>
              )}

              {usage.notes && (
                <P className="text-sm">{usage.notes}</P>
              )}

              {usage.created_at && (
                <Muted>
                  {format(new Date(usage.created_at), 'PPp')}
                </Muted>
              )}
            </Stack>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => usage.id && handleDelete(usage.id)}
              disabled={deletingId === usage.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}
