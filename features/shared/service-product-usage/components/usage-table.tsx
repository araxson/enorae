'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Edit2, Trash2, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { deleteServiceProductUsage } from '../api/mutations'
import type { ServiceProductUsageWithDetails } from '../api/queries'

type UsageTableProps = {
  usage: ServiceProductUsageWithDetails[]
  onEdit?: (usage: ServiceProductUsageWithDetails) => void
}

export function UsageTable({ usage, onEdit }: UsageTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteServiceProductUsage(formData)
      if (result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to delete usage mapping')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (usage.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Link className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No service-product usage mappings found</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Quantity per Service</TableHead>
            <TableHead>Required</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usage.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {record.service?.name || 'Unknown'}
              </TableCell>
              <TableCell>
                {record.product?.name || 'Unknown'}
              </TableCell>
              <TableCell>
                <code className="text-xs">{record.product?.sku || 'N/A'}</code>
              </TableCell>
              <TableCell className="text-right font-medium">
                {record.quantity_per_service}
              </TableCell>
              <TableCell>
                {!record.is_optional ? (
                  <Badge variant="default">Required</Badge>
                ) : (
                  <Badge variant="outline">Optional</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(record)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(record.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Usage Mapping</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service-product usage mapping? This action cannot be undone.
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
