'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
import { Small, P, Large } from '@/components/ui/typography'
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
                <Large>{supplier.name}</Large>
                {supplier.contact_name && (
                  <Small className="text-muted-foreground">
                    Contact: {supplier.contact_name}
                  </Small>
                )}
              </Box>
              <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                {supplier.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </Flex>

            <Stack gap="xs">
              {supplier.email && (
                <Flex gap="sm">
                  <Small className="text-muted-foreground">Email:</Small>
                  <Small>{supplier.email}</Small>
                </Flex>
              )}

              {supplier.phone && (
                <Flex gap="sm">
                  <Small className="text-muted-foreground">Phone:</Small>
                  <Small>{supplier.phone}</Small>
                </Flex>
              )}

              {supplier.website && (
                <Flex gap="sm">
                  <Small className="text-muted-foreground">Website:</Small>
                  <Small>
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </Small>
                </Flex>
              )}

              {supplier.address && (
                <Box>
                  <Small className="text-muted-foreground">Address:</Small>
                  <Small>{supplier.address}</Small>
                </Box>
              )}

              {supplier.payment_terms && (
                <Box>
                  <Small className="text-muted-foreground">Payment Terms:</Small>
                  <Small>{supplier.payment_terms}</Small>
                </Box>
              )}

              {supplier.notes && (
                <Box>
                  <Small className="text-muted-foreground">Notes:</Small>
                  <Small>{supplier.notes}</Small>
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
          <P>
            Are you sure you want to {supplier.is_active ? 'deactivate' : 'delete'}{' '}
            <strong>{supplier.name}</strong>?
          </P>
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
