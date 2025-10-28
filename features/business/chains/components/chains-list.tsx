'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, Building2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { deleteSalonChain } from '@/features/business/chains/api/mutations'
import type { SalonChainWithCounts } from '@/features/business/chains/api/queries'

type ChainsListProps = {
  chains: SalonChainWithCounts[]
  onEdit?: (chain: SalonChainWithCounts) => void
}

export function ChainsList({ chains, onEdit }: ChainsListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteSalonChain(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Salon chain deleted successfully')
      }
    } catch {
      toast.error('Failed to delete chain')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (chains.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 className="size-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No salon chains found</EmptyTitle>
          <EmptyDescription>Chains appear here once created.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Create a chain to group salons and manage shared metrics.</EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chains.map((chain) => (
          <Item key={chain['id']} variant="outline" className="flex flex-col items-start gap-4">
            <ItemHeader>
              <ItemTitle>{chain['name']}</ItemTitle>
              <Badge variant="secondary">
                {chain['salon_count'] || 0} locations
              </Badge>
            </ItemHeader>
            <ItemContent>
              {chain['legal_name'] ? (
                <ItemDescription>{chain['legal_name']}</ItemDescription>
              ) : null}
              {chain['staff_count'] !== null && chain['staff_count'] > 0 ? (
                <div className="text-sm text-muted-foreground">
                  {chain['staff_count']} staff members
                </div>
              ) : null}
            </ItemContent>
            <ItemActions>
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/business/chains/${chain['id']}`)}
                >
                  <Eye className="size-4 mr-2" />
                  View
                </Button>
                {onEdit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(chain)}
                  >
                    <Edit2 className="size-4 mr-2" />
                    Edit
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(chain['id'])}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </ButtonGroup>
            </ItemActions>
          </Item>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Salon Chain</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this salon chain? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
