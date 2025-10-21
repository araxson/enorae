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
                <span className="text-lg font-semibold">{supplier.name}</span>
                {supplier.contact_name && (
                  <small className="text-sm font-medium text-muted-foreground">
                    Contact: {supplier.contact_name}
                  </small>
                )}
              </div>
              <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                {supplier.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              {supplier.contact_email && (
                <div className="flex gap-3">
                  <small className="text-sm font-medium text-muted-foreground">Email:</small>
                  <small className="text-sm font-medium">{supplier.contact_email}</small>
                </div>
              )}

              {supplier.contact_phone && (
                <div className="flex gap-3">
                  <small className="text-sm font-medium text-muted-foreground">Phone:</small>
                  <small className="text-sm font-medium">{supplier.contact_phone}</small>
                </div>
              )}

              {supplier.website && (
                <div className="flex gap-3">
                  <small className="text-sm font-medium text-muted-foreground">Website:</small>
                  <small className="text-sm font-medium">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </small>
                </div>
              )}

              {supplier.address && (
                <div>
                  <small className="text-sm font-medium text-muted-foreground">Address:</small>
                  <small className="text-sm font-medium">{supplier.address}</small>
                </div>
              )}

              {supplier.payment_terms && (
                <div>
                  <small className="text-sm font-medium text-muted-foreground">Payment Terms:</small>
                  <small className="text-sm font-medium">{supplier.payment_terms}</small>
                </div>
              )}

              {supplier.notes && (
                <div>
                  <small className="text-sm font-medium text-muted-foreground">Notes:</small>
                  <small className="text-sm font-medium">{supplier.notes}</small>
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
