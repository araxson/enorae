'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { bulkAssignRoles } from '@/features/admin/roles/api/mutations'
import type { RoleTemplate } from './role-templates'
import type { RoleValue } from './types'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { BulkAssignRow, type RowState } from './bulk-assign-row'

interface BulkAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salons: Array<{ id: string; name: string }>
}

const MAX_ROWS = 10

export function BulkAssignDialog({ open, onOpenChange, salons }: BulkAssignDialogProps) {
  const [rows, setRows] = useState<RowState[]>([{ userId: '', role: '', salonId: '', templateId: '', permissions: [] }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTemplateSelect = (index: number, template: RoleTemplate | undefined) => {
    setRows((current) => {
      const next = [...current]
      const currentRow = next[index]
      if (!currentRow) return current
      next[index] = {
        ...currentRow,
        templateId: template?.id ?? '',
        role: template ? (template.role as RoleValue) : currentRow.role,
        permissions: template?.permissions ?? currentRow.permissions,
      }
      return next
    })
  }

  const handleRowChange = (index: number, patch: Partial<RowState>) => {
    setRows((current) => {
      const next = [...current]
      const currentRow = next[index]
      if (!currentRow) return current
      next[index] = { ...currentRow, ...patch }
      return next
    })
  }

  const handleAddRow = () => {
    if (rows.length >= MAX_ROWS) {
      toast.warning(`You can add up to ${MAX_ROWS} assignments at a time.`)
      return
    }
    setRows((current) => [...current, { userId: '', role: '', salonId: '', templateId: '', permissions: [] }])
  }

  const handleRemoveRow = (index: number) => {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
  }

  const handleSubmit = async () => {
    const payload = rows
      .map((row) => {
        if (!row.userId || !row.role) return null
        return {
          userId: row.userId,
          role: row.role,
          salonId: row.salonId || undefined,
          permissions: row.permissions,
        }
      })
      .filter(Boolean)

    if (payload.length === 0) {
      toast.error('Add at least one valid assignment')
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('payload', JSON.stringify(payload))

    const result = await bulkAssignRoles(formData)
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    const { success: successCount, failed: failureCount, errors } = result.data

    if (failureCount > 0) {
      toast.warning(`Assigned ${successCount} roles. ${failureCount} failed.`)
      if (errors.length) {
        console.warn('[bulkAssignRoles] Failed assignments:', errors)
      }
    } else {
      toast.success(`Assigned ${successCount} roles successfully.`)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Users className="size-5" />
            <DialogTitle>Bulk assign roles</DialogTitle>
          </div>
          <DialogDescription>
            Quickly assign multiple roles. Templates prefill recommended permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          {rows.map((row, index) => (
            <BulkAssignRow
              key={index}
              index={index}
              row={row}
              salons={salons}
              canRemove={rows.length > 1}
              onChange={handleRowChange}
              onRemove={handleRemoveRow}
              onTemplateSelect={handleTemplateSelect}
            />
          ))}

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handleAddRow}>
              Add another
            </Button>
            <ButtonGroup>
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Assigning…</span>
                  </>
                ) : (
                  <span>Assign roles</span>
                )}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
