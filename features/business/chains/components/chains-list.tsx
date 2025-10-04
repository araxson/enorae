'use client'

import { useState } from 'react'
import { Edit2, Trash2, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { deleteSalonChain } from '../api/mutations'
import type { SalonChainWithCounts } from '../api/queries'

type ChainsListProps = {
  chains: SalonChainWithCounts[]
  onEdit?: (chain: SalonChainWithCounts) => void
}

export function ChainsList({ chains, onEdit }: ChainsListProps) {
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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No salon chains found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chains.map((chain) => (
          <Card key={chain.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{chain.name}</CardTitle>
                  {chain.legal_name && (
                    <CardDescription className="mt-1">
                      {chain.legal_name}
                    </CardDescription>
                  )}
                </div>
                <Badge variant="secondary">
                  {chain.salon_count || 0} salons
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(chain)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(chain.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
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
