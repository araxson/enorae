'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { deleteSupplier } from '../api/mutations'
import type { Supplier } from '@/lib/types/app.types'

interface SupplierCardProps {
  supplier: Supplier
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      if (!supplier.id) {
        return
      }
      const formData = new FormData()
      formData.append('id', supplier.id)
      const result = await deleteSupplier(formData)
      if (result.success) {
        setShowDeleteDialog(false)
      }
    })
  }

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{supplier.name}</p>
                {supplier.contact_name && (
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact: {supplier.contact_name}
                  </p>
                )}
              </div>
              <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                {supplier.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              {supplier.contact_email && (
                <div className="flex gap-3">
                  <p className="text-sm font-medium text-muted-foreground">Email:</p>
                  <p className="text-sm font-medium">{supplier.contact_email}</p>
                </div>
              )}

              {supplier.contact_phone && (
                <div className="flex gap-3">
                  <p className="text-sm font-medium text-muted-foreground">Phone:</p>
                  <p className="text-sm font-medium">{supplier.contact_phone}</p>
                </div>
              )}

              {supplier.website && (
                <div className="flex gap-3">
                  <p className="text-sm font-medium text-muted-foreground">Website:</p>
                  <p className="text-sm font-medium">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </p>
                </div>
              )}

              {supplier.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address:</p>
                  <p className="text-sm font-medium">{supplier.address}</p>
                </div>
              )}

              {supplier.payment_terms && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Terms:</p>
                  <p className="text-sm font-medium">{supplier.payment_terms}</p>
                </div>
              )}

              {supplier.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes:</p>
                  <p className="text-sm font-medium">{supplier.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
              >
                {supplier.is_active ? 'Deactivate' : 'Delete'}
              </Button>
              <Button size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {supplier.is_active ? 'Deactivate' : 'Delete'} Supplier
            </DialogTitle>
          </DialogHeader>
          <p className="leading-7">
            Are you sure you want to {supplier.is_active ? 'deactivate' : 'delete'}{' '}
            <strong>{supplier.name}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending
                ? 'Processing...'
                : supplier.is_active
                  ? 'Deactivate'
                  : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
