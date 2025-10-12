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
import { Input } from '@/components/ui/input'
import { Stack, Flex } from '@/components/layout'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { bulkAssignRoles } from '../api/mutations'
import { RoleSelector } from './role-selector'
import { SalonSelector } from './salon-selector'
import type { RoleTemplate } from './role-templates'
import { ROLE_PERMISSION_TEMPLATES } from './role-templates'
import type { RoleValue } from './types'

interface BulkAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salons: Array<{ id: string; name: string }>
}

interface RowState {
  userId: string
  role: RoleValue | ''
  salonId: string
  templateId: string
  permissions: string[]
}

const MAX_ROWS = 10

export function BulkAssignDialog({ open, onOpenChange, salons }: BulkAssignDialogProps) {
  const [rows, setRows] = useState<RowState[]>([{ userId: '', role: '', salonId: '', templateId: '', permissions: [] }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTemplateSelect = (index: number, template: RoleTemplate | undefined) => {
    setRows((current) => {
      const next = [...current]
      next[index] = {
        ...next[index],
        templateId: template?.id ?? '',
        role: template ? (template.role as RoleValue) : next[index].role,
        permissions: template?.permissions ?? next[index].permissions,
      }
      return next
    })
  }

  const handleRowChange = (index: number, patch: Partial<RowState>) => {
    setRows((current) => {
      const next = [...current]
      next[index] = { ...next[index], ...patch }
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
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk assign roles
          </DialogTitle>
          <DialogDescription>
            Quickly assign multiple roles. Templates prefill recommended permissions.
          </DialogDescription>
        </DialogHeader>

        <Stack gap="lg">
          {rows.map((row, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-4">
              <Flex gap="md" className="flex-col md:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`user-${index}`}>User ID *</Label>
                  <Input
                    id={`user-${index}`}
                    value={row.userId}
                    onChange={(event) => handleRowChange(index, { userId: event.target.value })}
                    placeholder="User UUID"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveRow(index)} disabled={rows.length === 1}>
                  Remove
                </Button>
              </Flex>

              <RoleSelector
                role={row.role}
                onRoleChange={(value) => handleRowChange(index, { role: value })}
                templateId={row.templateId}
                onTemplateChange={(template) => handleTemplateSelect(index, template)}
              />

              {row.role && ROLES_NEEDING_SALON.includes(row.role) && (
                <SalonSelector salons={salons} value={row.salonId} onChange={(value) => handleRowChange(index, { salonId: value })} required />
              )}
            </div>
          ))}

          <Flex justify="between">
            <Button type="button" variant="outline" onClick={handleAddRow}>
              Add another
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign roles'}
            </Button>
          </Flex>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

const ROLES_NEEDING_SALON: RoleValue[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]
