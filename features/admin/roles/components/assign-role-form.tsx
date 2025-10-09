'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Stack, Flex } from '@/components/layout'
import { toast } from 'sonner'
import { assignRole } from '../api/mutations'
import { PermissionsEditor } from './permissions-editor'
import { RoleSelector } from './role-selector'
import { SalonSelector } from './salon-selector'
import type { RoleTemplate } from '../utils/templates'
import type { RoleValue } from './types'

type AssignRoleFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salons: Array<{ id: string; name: string }>
}

const ROLES_NEEDING_SALON: RoleValue[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]

export function AssignRoleForm({ open, onOpenChange, salons }: AssignRoleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<RoleValue | ''>('')
  const [salonId, setSalonId] = useState('')
  const [permissions, setPermissions] = useState<string[]>([])
  const [templateId, setTemplateId] = useState('')

  useEffect(() => {
    if (!open) {
      setUserId('')
      setRole('')
      setSalonId('')
      setPermissions([])
      setTemplateId('')
    }
  }, [open])

  const needsSalon = role ? ROLES_NEEDING_SALON.includes(role) : false

  const handleTemplateChange = (template: RoleTemplate | undefined) => {
    setTemplateId(template?.id ?? '')
    if (template) {
      setRole(template.role as RoleValue)
      setPermissions(template.permissions)
    }
  }

  const handleAddPermission = (permission: string) => {
    if (permissions.includes(permission)) {
      toast.warning('Permission already added')
      return
    }
    setPermissions((current) => [...current, permission])
  }

  const handleRemovePermission = (permission: string) => {
    setPermissions((current) => current.filter((item) => item !== permission))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!userId || !role) {
      toast.error('User ID and role are required')
      return
    }

    if (needsSalon && !salonId) {
      toast.error('This role requires a salon assignment')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('role', role)
    if (salonId) formData.append('salonId', salonId)
    if (permissions.length > 0) formData.append('permissions', JSON.stringify(permissions))

    const result = await assignRole(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The role has been assigned successfully.')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assign Role
          </DialogTitle>
          <DialogDescription>
            Assign a role to a user and optionally configure granular permissions with templates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Stack gap="md">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID *</Label>
                <Input
                  id="userId"
                  placeholder="Enter user UUID"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">The UUID of the user to assign the role to</p>
              </div>

              <RoleSelector
                role={role}
                onRoleChange={(value) => {
                  setRole(value)
                  setTemplateId('')
                }}
                templateId={templateId}
                onTemplateChange={handleTemplateChange}
              />

              {needsSalon && (
                <SalonSelector salons={salons} value={salonId} onChange={setSalonId} required />
              )}
            </Stack>

            <Stack gap="sm">
              <Flex align="center" justify="between">
                <Label>Permissions</Label>
                <p className="text-xs text-muted-foreground">Templates prefill permissions; add or remove as needed.</p>
              </Flex>
              <PermissionsEditor
                permissions={permissions}
                onAdd={handleAddPermission}
                onRemove={handleRemovePermission}
              />
            </Stack>

            <Flex justify="end" gap="md">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Assigning...' : 'Assign Role'}
              </Button>
            </Flex>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
