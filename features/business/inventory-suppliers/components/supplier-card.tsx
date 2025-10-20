'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
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
          <Stack gap="sm">
            <Flex justify="between" align="start">
              <Box>
                <span className="text-lg font-semibold">{supplier.name}</span>
                {supplier.contact_name && (
                  <small className="text-sm font-medium leading-none text-muted-foreground">
                    Contact: {supplier.contact_name}
                  </small>
                )}
              </Box>
              <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                {supplier.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </Flex>

            <Stack gap="xs">
              {supplier.email && (
                <Flex gap="sm">
                  <small className="text-sm font-medium leading-none text-muted-foreground">Email:</small>
                  <small className="text-sm font-medium leading-none">{supplier.email}</small>
                </Flex>
              )}

              {supplier.phone && (
                <Flex gap="sm">
                  <small className="text-sm font-medium leading-none text-muted-foreground">Phone:</small>
                  <small className="text-sm font-medium leading-none">{supplier.phone}</small>
                </Flex>
              )}

              {supplier.website && (
                <Flex gap="sm">
                  <small className="text-sm font-medium leading-none text-muted-foreground">Website:</small>
                  <small className="text-sm font-medium leading-none">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </small>
                </Flex>
              )}

              {supplier.address && (
                <Box>
                  <small className="text-sm font-medium leading-none text-muted-foreground">Address:</small>
                  <small className="text-sm font-medium leading-none">{supplier.address}</small>
                </Box>
              )}

              {supplier.payment_terms && (
                <Box>
                  <small className="text-sm font-medium leading-none text-muted-foreground">Payment Terms:</small>
                  <small className="text-sm font-medium leading-none">{supplier.payment_terms}</small>
                </Box>
              )}

              {supplier.notes && (
                <Box>
                  <small className="text-sm font-medium leading-none text-muted-foreground">Notes:</small>
                  <small className="text-sm font-medium leading-none">{supplier.notes}</small>
                </Box>
              )}
            </Stack>

            <Flex justify="end" gap="sm">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
              >
                {supplier.is_active ? 'Deactivate' : 'Delete'}
              </Button>
              <Button size="sm">Edit</Button>
            </Flex>
          </Stack>
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
